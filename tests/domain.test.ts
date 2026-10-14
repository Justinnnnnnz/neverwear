import { test } from "node:test";
import assert from "node:assert/strict";
import { totals, formatPrice } from "../src/lib/pricing";
import {
  shoeSizes,
  euSizes,
  footLengths,
  convertShoeSize,
} from "../src/lib/sizes";
import { hourSeed, viewers, trackingStep, monthKey } from "../src/lib/sim";
import { monthlyReport } from "../src/lib/report";
import { closetEntries } from "../src/lib/closet";
import { safeStorage } from "../src/lib/storage";
import type { CartItem, Order, ClosetItem } from "../src/types";
const item = (productId: string, qty = 1): CartItem => ({
  productId,
  qty,
  color: "黑色",
  size: "S",
  addedAt: 0,
});
test("shipping threshold and HST include shipping in integer cents", () => {
  assert.deepEqual(totals([]), { subtotal: 0, shipping: 0, tax: 0, total: 0 });
  assert.deepEqual(totals([item("p05")]), {
    subtotal: 3800,
    shipping: 1200,
    tax: 650,
    total: 5650,
  });
  assert.deepEqual(totals([item("p05", 4)]), {
    subtotal: 15200,
    shipping: 0,
    tax: 1976,
    total: 17176,
  });
  assert.deepEqual(totals([item("p05", 4)], "express"), {
    subtotal: 15200,
    shipping: 2500,
    tax: 2301,
    total: 20001,
  });
  assert.equal(formatPrice(128400), "$1,284.00");
});
test("all eleven reference shoe conversions preserve their US index", () => {
  for (let i = 0; i < 11; i++) {
    assert.equal(convertShoeSize(shoeSizes[i], "EU"), euSizes[i]);
    assert.equal(convertShoeSize(shoeSizes[i], "CN"), footLengths[i]);
    assert.equal(convertShoeSize(shoeSizes[i], "US"), shoeSizes[i]);
  }
});
test("viewers remain deterministic within each hour and bounded", () => {
  const now = Date.UTC(2026, 9, 14, 18);
  assert.equal(hourSeed("p01", now), hourSeed("p01", now + 3599999));
  for (let i = 1; i <= 24; i++) {
    const count = viewers(`p${i}`, now);
    assert.ok(count >= 8 && count <= 37);
    assert.equal(count, viewers(`p${i}`, now));
  }
});
test("tracking advances at exact boundaries and never reaches delivered", () => {
  const start = 100;
  assert.equal(trackingStep(start, start + 179999), 0);
  assert.equal(trackingStep(start, start + 180000), 1);
  assert.equal(trackingStep(start, start + 1199999), 1);
  assert.equal(trackingStep(start, start + 1200000), 2);
  assert.equal(trackingStep(start, start + 7200000), 3);
  assert.equal(trackingStep(start, start + 100 * 86400000), 3);
});
test("reports use Toronto month boundaries, quantities and totals", () => {
  const date = Date.UTC(2026, 10, 1, 3, 30);
  assert.equal(monthKey(date), "2026-10");
  const orders: Order[] = [
    {
      id: "test",
      items: [{ ...item("p05", 2), color: "白色" }],
      ...totals([item("p05", 2)]),
      shippingMethod: "standard",
      address: { city: "Toronto", province: "ON" },
      createdAt: date,
    },
  ];
  const r = monthlyReport(orders, "2026-10");
  assert.equal(r.orders, 1);
  assert.equal(r.items, 2);
  assert.equal(r.color, "白色");
  assert.equal(r.latest, "23:30");
  assert.equal(monthlyReport(orders, "2026-11").orders, 0);
});
test("saved outfit keys survive prepending an order and distinguish duplicate pieces", () => {
  const old: ClosetItem = {
    productId: "p05",
    color: "白色",
    size: "S",
    orderId: "NW-old",
    addedAt: 0,
  };
  const newer = { ...old, orderId: "NW-new" };
  const original = closetEntries([old, old]);
  const updated = closetEntries([newer, old, old]);
  assert.equal(original[0].key, updated[1].key);
  assert.equal(original[1].key, updated[2].key);
  assert.notEqual(original[0].key, original[1].key);
});
test("storage-denied browsers and missing browser globals remain renderable", () => {
  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: {
        getItem() {
          throw Error("denied");
        },
        setItem() {
          throw Error("denied");
        },
        removeItem() {
          throw Error("denied");
        },
      },
    },
    configurable: true,
  });
  assert.equal(safeStorage.getItem("test"), null);
  assert.doesNotThrow(() => safeStorage.setItem("test", "value"));
  assert.doesNotThrow(() => safeStorage.removeItem("test"));
  Reflect.deleteProperty(globalThis, "window");
  assert.equal(safeStorage.getItem("test"), null);
});
test("placing an order transfers every quantity into the closet and prevents an empty repeat", async () => {
  const { useShop } = await import("../src/store/shop");
  useShop.setState({ cart: [], orders: [], closet: [], wishlist: [] });
  const before = Date.now();
  useShop.getState().add({ ...item("p05", 2), color: "白色" });
  const id = useShop
    .getState()
    .placeOrder("standard", { city: "Toronto", province: "ON" });
  assert.ok(id?.startsWith("NW-"));
  const state = useShop.getState();
  assert.equal(state.cart.length, 0);
  assert.equal(state.orders.length, 1);
  assert.equal(state.closet.length, 2);
  assert.ok(state.orders[0].createdAt >= before);
  assert.equal(state.orders[0].total, 9944);
  assert.ok(state.closet.every((i) => i.orderId === id));
  assert.equal(
    state.placeOrder("standard", { city: "Toronto", province: "ON" }),
    null,
  );
});

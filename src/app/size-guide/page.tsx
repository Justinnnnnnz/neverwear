import { shoeSizes, euSizes, footLengths } from "@/lib/sizes";
export default function SizeGuide() {
  const apparel = [
    ["XXS", "76–79", "58–61", "83–86"],
    ["XS", "80–83", "62–65", "87–90"],
    ["S", "84–87", "66–69", "91–94"],
    ["M", "88–93", "70–75", "95–100"],
    ["L", "94–99", "76–81", "101–106"],
    ["XL", "100–105", "82–87", "107–112"],
  ];
  return (
    <main className="container section narrow">
      <p className="eyebrow muted">FIND YOUR FIT</p>
      <h1>尺码指南</h1>
      <section className="section stack">
        <h2>Apparel</h2>
        <p className="muted">
          身体围度参考，单位 cm。请结合商品页的 Fit 说明选择尺码。
        </p>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">服装尺码参考</caption>
            <thead>
              <tr>
                {["尺码", "胸围", "腰围", "臀围"].map((s) => (
                  <th scope="col" key={s}>
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apparel.map((row) => (
                <tr key={row[0]}>
                  {row.map((x, i) =>
                    i === 0 ? (
                      <th scope="row" key={i}>
                        {x}
                      </th>
                    ) : (
                      <td key={i}>{x}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <strong>如何测量</strong>
          <p>
            胸围：软尺围绕胸部最丰满处。腰围：自然腰线最细处。臀围：臀部最丰满处。保持软尺水平，贴合身体但不要拉紧。
          </p>
        </div>
      </section>
      <section className="section stack">
        <h2>Shoes</h2>
        <p>女鞋 · 参考换算</p>
        <p className="muted">
          CN 以脚长 mm 显示。不同鞋型的 Fit 可能不同，请优先参考商品页说明。
        </p>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">女鞋 US EU 脚长参考换算</caption>
            <thead>
              <tr>
                <th scope="col">US</th>
                <th scope="col">EU</th>
                <th scope="col">脚长 mm / CN</th>
              </tr>
            </thead>
            <tbody>
              {shoeSizes.map((s, i) => (
                <tr key={s}>
                  <th scope="row">{s}</th>
                  <td>{euSizes[i]}</td>
                  <td>{footLengths[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <strong>测量脚长</strong>
          <p>
            赤脚站在纸上，从脚跟量至最长脚趾。两只脚分别测量，以较长的一只为准。
          </p>
        </div>
      </section>
    </main>
  );
}

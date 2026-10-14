# Prompt to paste into Codex

Copy everything inside the box below into Codex, run from this folder.

---

```
You are building NeverWear, a simulated fashion shopping website, from scratch in this folder, end to end, without waiting for me between steps.

1. Read AGENTS.md, docs/SPEC.md, docs/DESIGN.md, docs/IMAGES.md, data/products.json and docs/mockups/README.md (then skim the 6 mockup files) before writing any code. Follow AGENTS.md's hard rules at all times.

2. Git + GitHub setup (do this first):
   - If this folder is not a git repo, run `git init -b main`.
   - Check `gh auth status`. If gh is missing or not logged in, STOP and tell me exactly what to run (e.g. `gh auth login`), then continue once I confirm.
   - Create a PRIVATE GitHub repo named `neverwear` under my account and set it as `origin`: `gh repo create neverwear --private --source=. --remote=origin`. If a repo with that name already exists on my account, use it as origin instead of creating a new one.

3. Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint, src/ dir, import alias @/*). create-next-app refuses non-empty folders, so scaffold into a temporary folder (e.g. `_scaffold`), move its contents into the repo root without overwriting AGENTS.md, CODEX_PROMPT.md, docs/ or data/, then delete the temp folder. Keep docs/ and data/ committed.

4. Implement docs/SPEC.md › "Commit plan" items 0 → 18 in order. Item 17 is the product photography: generate the images yourself with your built-in image generation ($imagegen / image_gen), following docs/IMAGES.md exactly. Generate Phase 1 ONLY — exactly 76 images: for each of the 34 products an on-model front try-on shot and a product close-up (first colour), plus 2 home hero images and 6 category covers. Do not generate Phase 2 images. Use one consistent premium minimalist studio style with a recurring cast of fictional models; Atelier follows its luxury studio variation and legs-and-feet framing in docs/IMAGES.md; no brand names in prompts, no logos or text; correct file paths, WebP conversion, and wiring into products.json in gallery order. Move each generated file from your generated_images folder into the project as soon as it is created. For EACH item:
   - implement it fully, meeting its acceptance criteria and the look/copy of docs/DESIGN.md and the mockups;
   - run `npm run lint` and `npm run build`; fix every error;
   - commit with the Conventional Commit message given in the plan;
   - `git push origin main`.
   Do not batch several items into one commit and do not skip items. If something is genuinely impossible, implement the closest version, note it in the commit body, and keep going.

5. Self-check before the last commit: open the main flows in your head/test them (home → category → filter → PDP → choose colour + size → add to cart → checkout → order tracking → closet → report), at 390px and 1440px widths. Make sure no page has horizontal scroll, there are no console errors, and no copy breaks the DESIGN.md copy rules.

6. Finish: run `npm run build`, start `npm run dev` in the background (port 3000, or the next free port), verify the home page returns HTTP 200, and reply with:
   - the local URL (e.g. http://localhost:3000),
   - the GitHub repo URL,
   - the list of commits (`git log --oneline`),
   - the command to start it again later (`npm run dev`),
   - how many of the 56 Phase 1 images you generated, and which (if any) still use placeholders,
   - anything you could not complete.
```

---

Tips
- Run Codex locally in this folder (not a cloud task) so the localhost link works on your computer.
- Allow Codex to run commands and use the network when it asks (npm install, git push).
- Image generation needs a paid ChatGPT plan (it isn't on Free) and uses your limits faster than text. If Codex runs out midway, just start Codex again in this folder and say: "Continue docs/IMAGES.md from data/image-manifest.json, then commit and push." It skips images that already exist.

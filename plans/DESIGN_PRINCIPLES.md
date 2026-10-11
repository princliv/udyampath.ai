# UdyamPath — Design Principles

> The visual and interaction system for every UdyamPath screen. If a component or page disagrees with this doc, this doc wins. If this doc is missing something, add it here first, then build it.
>
> Companion: [PLAN.md](PLAN.md). Implementation lives in `src/styles/tokens.css` (CSS variables), the Tailwind v4 `@theme`, and `src/components/ui/`.

**Personality:** *a calm, trustworthy mentor.* Clean like Coursera, warm like a good senior, honest like a bank statement. We serve students who may be on a ₹10k phone with patchy 4G, and the product is about their money and their careers. **Clarity beats flash.**

---

## 1. Seven principles

1. **Content first, chrome second.**
   - Course titles, progress, deadlines and rupee amounts are the heroes.
   - Decoration (gradients, glass, illustration) is allowed only where there is no dense content: hero bands, empty states and celebration moments.
2. **Always show the path.**
   - Every learner screen answers *"Where am I, what's next, how far to job-ready?"*
   - Pathway steppers, progress bars and the next-step CTA are never more than one glance away.
3. **Honest numbers.**
   - Money, scores and time saved always show **how they were computed** (a "Why?" popover).
   - Estimates are labelled *estimated*.
   - Never show fabricated data or charts.
4. **One system, many rooms.**
   - Every section uses the same components, spacing and type.
   - Sections are told apart by a **single accent colour**, not by different layouts or fonts.
5. **Built for every phone.**
   - Design mobile-first at **360px**, with tap targets ≥ 44px.
   - Pages must work on slow networks: skeletons, lazy media, no autoplay video, ≤ 200 KB JS on first route.
6. **Accessible by default.**
   - WCAG 2.2 AA is the minimum.
   - Colour is never the only signal; every status chip has an icon and text.
7. **Motion with a purpose.**
   - Animate to explain change: a step completing, a panel opening, a badge earned.
   - Never animate just to decorate a list.
   - Respect `prefers-reduced-motion`.

---

## 2. Colour

All colours are **CSS variables**. Components never contain raw hex values; lint will flag them.

### 2.1 Brand (UdyamPath blue)
Built from the existing brand colours `#1181c8` and `#004aad`.

| Token | Hex | Use |
|---|---|---|
| `--brand-50` | `#eef7fd` | Tinted backgrounds, selected rows |
| `--brand-100` | `#d6ecfa` | Hover backgrounds, chip fill |
| `--brand-200` | `#aed8f4` | Borders on brand surfaces |
| `--brand-300` | `#78bdea` | Illustrations, charts |
| `--brand-400` | `#3f9fdc` | Focus ring (with offset) |
| `--brand-500` | `#1181c8` | **Logo, large display text, icons, decorative fills** |
| `--brand-600` | `#0b6aa6` | **Primary buttons, links, active nav** (white text 5.8:1 ✅) |
| `--brand-700` | `#0a5687` | Button hover/pressed |
| `--brand-800` | `#0d466e` | Text on brand-50 |
| `--brand-deep` | `#004aad` | Hero gradients (`brand-500 → brand-deep`), footer |

> ⚠️ `#1181c8` with white text is only **4.2:1**, which fails AA for normal text. Use `--brand-600` for any button or link text.

### 2.2 Neutrals (slate)
| Token | Hex | Use |
|---|---|---|
| `--n-0` | `#ffffff` | Surfaces (cards, modals) |
| `--n-50` | `#f8fafc` | Page background |
| `--n-100` | `#f1f5f9` | Subtle fill, table stripes, skeleton base |
| `--n-200` | `#e2e8f0` | Borders, dividers |
| `--n-300` | `#cbd5e1` | Input borders, disabled outlines |
| `--n-500` | `#64748b` | Placeholder, captions (≥ 14px only) |
| `--n-600` | `#475569` | Secondary text |
| `--n-800` | `#1e293b` | Headings |
| `--n-900` | `#0f172a` | Body text |

### 2.3 Semantic
| Role | Text / icon | Background | Border |
|---|---|---|---|
| Success | `#15803d` | `#dcfce7` | `#86efac` |
| Warning | `#b45309` | `#fef3c7` | `#fcd34d` |
| Danger | `#b91c1c` | `#fee2e2` | `#fca5a5` |
| Info | `--brand-700` | `--brand-50` | `--brand-200` |

### 2.4 Section accents ("one system, many rooms")
These are kept from the existing per-section identity. Each section has a **decorative** shade (illustrations, hero band, icon tiles, active tab underline) and an **ink** shade (accent text and buttons, AA-safe on white). Accents appear in at most **three places per screen**: section hero, active navigation and primary CTA. Body, cards and forms stay neutral.

| Section | Decorative `--accent-500` | Ink `--accent-700` | Hero band gradient |
|---|---|---|---|
| Home | `#1181c8` | `#0b6aa6` | `brand-500 → brand-deep` |
| Learn (courses, specializations, pathway) | `#7c6bff` | `#4f3fd1` | `#7c6bff → #4f3fd1` |
| Simulator | `#c026d3` | `#a21caf` | `#c026d3 → #7e22ce` |
| Jobs & cost of living | `#0ea5e9` | `#0369a1` | `#0ea5e9 → #0369a1` |
| Career tools | `#f97316` | `#c2410c` | `#fb923c → #c2410c` |
| Notes & study | `#0d9488` | `#0f766e` | `#14b8a6 → #0f766e` |
| Profile | `#7c3aed` | `#6d28d9` | `#8b5cf6 → #6d28d9` |
| Recruiter | `#1e293b` | `#1e293b` + gold `#fbbf24` highlights | `#1e293b → #0f172a` |
| Admin | `--n-800` | `--n-900` | none (plain, dense UI) |

Each layout sets `data-section="learn"` (etc.) on `<main>`, and `--accent-*` resolves from it. Components only reference `--accent-*`, so the same `Button` is violet in Learn and sky in Jobs with no prop.

### 2.5 Status colours (shared vocabulary across the product)
| Status | Colour | Icon (lucide) |
|---|---|---|
| Locked | `--n-500` on `--n-100` | `Lock` |
| Required / not started | `--n-600` on `--n-0`, border `--n-300` | `Circle` |
| In progress | `--brand-700` on `--brand-50` | `CircleDashed` |
| Completed | success | `CheckCircle2` |
| Credited — test | success, outlined | `BadgeCheck` |
| Credited — credential | success, outlined | `ScrollText` |
| Pending verification | warning | `Hourglass` |
| Deadline < 24h | warning; < 2h danger | `Clock` |
| Recommended job | success | `TrendingUp` + "+₹X/mo" |
| Not recommended | danger (soft) | `TrendingDown` + "−₹X/mo" |
| Remote / Your city | info | `Globe` / `MapPin` |
| Job-Ready Badge | gold `#b45309` on `#fef3c7` | `Award` |

### 2.6 Data visualisation
- **Expense categories always have the same colour on every chart:**

  | Category | Colour |
  |---|---|
  | Rent | `#6366f1` |
  | Food | `#f59e0b` |
  | Transport | `#0ea5e9` |
  | Utilities | `#10b981` |
  | Misc | `#ec4899` |
  | Other | `#94a3b8` |

- Salary vs. expense: salary is `--brand-600`, expense is stacked categories, and surplus/shortfall uses success/danger.
- Pie or donut charts only for one city's breakdown (≤ 6 slices). Comparisons use **stacked horizontal bars**. Trends use lines with points.
- Every chart has value labels in ₹ (en-IN), a text summary for screen readers, and is readable in greyscale (order + labels, not colour alone).

### 2.7 Dark mode
Tokens ship with a dark set from day one (`[data-theme="dark"]` + `prefers-color-scheme`). The full dark UI ships in Phase 9. Never hard-code `white` or `black`; use `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--border`, which map to neutrals per theme.

---

## 3. Typography

- **UI & headings:** **Plus Jakarta Sans** (already loaded). Weights **400, 500, 600, 700, 800**.
- **Code:** **JetBrains Mono** (editor, inline code, simulator tasks).
- **Fallback stack:** `"Plus Jakarta Sans", "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. `Noto Sans Devanagari` is added when Hindi ships.
- **Remove** the ad-hoc Segoe UI / Inter / Roboto / Poppins / Arial overrides in components.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `display` | 48/56 (mobile 36/44) | 800 | Home hero only |
| `h1` | 36/44 (mobile 30/38) | 700 | Page title |
| `h2` | 30/38 (mobile 24/32) | 700 | Section title |
| `h3` | 24/32 | 600 | Card group, modal title |
| `h4` | 20/28 | 600 | Card title |
| `body-lg` | 18/28 | 400 | Lesson reading text |
| `body` | 16/24 | 400 | Default |
| `body-sm` | 14/20 | 400/500 | Meta, table cells |
| `caption` | 12/16 | 500 | Chips, labels (never body text) |
| `overline` | 12/16, +0.08em, uppercase | 700 | Section eyebrow ("SPECIALIZATION") |

**Rules:**
- Body text is never smaller than 16px on mobile.
- Reading width is **65–75 characters** (`max-width: 70ch`) in lessons and articles.
- Numbers in tables and money use `font-variant-numeric: tabular-nums`.
- Headings are sentence case ("Find your next job"), not Title Case.

---

## 4. Space, layout, shape, depth

**Spacing:** 4px base. Scale: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`.
- Inside cards: 16 (mobile) / 24 (desktop).
- Between sections: 48 (mobile) / 80 (desktop).
- Use the scale only, never arbitrary values like 13px.

**Breakpoints** (replace the current 820 / 1120 custom ones):

| Name | Min width | Layout |
|---|---|---|
| base | 0 | 1 column, 16px gutters, bottom dock nav |
| `sm` | 640 | 2-column card grids |
| `md` | 768 | Side panels become drawers |
| `lg` | 1024 | Top nav replaces bottom dock; sidebars visible; 3–4 column grids |
| `xl` | 1280 | Container max-width **1200px** content + gutters |

**Grid:** 4 columns on mobile, 8 on tablet, 12 on desktop, with 16 / 24 / 24 px gutters.

**Radius:**

| Token | Value | Use |
|---|---|---|
| `sm` | 6px | Chips, inputs inside tables |
| `md` | 10px | Buttons, inputs |
| `lg` | 14px | Cards |
| `xl` | 20px | Modals, hero panels |
| `full` | — | Pills, avatars |

**Elevation** (use sparingly; borders do most of the work):

| Token | Value | Use |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgb(15 23 42 / .06)` | Resting cards (with a 1px `--n-200` border) |
| `shadow-sm` | `0 2px 8px rgb(15 23 42 / .08)` | Hovered cards, dropdowns |
| `shadow-md` | `0 8px 24px rgb(15 23 42 / .12)` | Popovers, sticky enroll card |
| `shadow-lg` | `0 16px 48px rgb(15 23 42 / .18)` | Modals |

### 4.1 Glassmorphism — the rule
The current `GlassCard` look stays, but **only in these places**:
- the header when scrolled over a hero
- hero overlays and the three home feature cards on the hero gradient
- modal/sheet backdrops
- celebration overlays (certificate, badge)

It is **never** used for text-dense cards: course cards, job cards, tables, forms, lesson content, simulator workspace.

```css
.glass {
  background: rgb(255 255 255 / .14);
  backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgb(255 255 255 / .25);
  border-radius: var(--radius-xl);
}
@supports not (backdrop-filter: blur(1px)) { .glass { background: rgb(15 23 42 / .72); } }
@media (prefers-reduced-transparency: reduce) { .glass { background: var(--surface); backdrop-filter: none; } }
```
*Why:* blur is expensive on low-end phones, and translucent cards over gradients reduce text contrast. This replaces the "glass on ALL cards" rule in `.github/agents/vishwakarma.agent.md`.

---

## 5. Motion

| Token | Duration | Easing | Use |
|---|---|---|---|
| `fast` | 120ms | `cubic-bezier(.2,0,0,1)` | Hover, press, chip toggle |
| `base` | 200ms | `cubic-bezier(.2,0,0,1)` | Dropdowns, tabs, accordion |
| `slow` | 320ms | `cubic-bezier(.16,1,.3,1)` | Modals, drawers, page transition |
| `celebrate` | 600–1200ms | spring | Certificate, badge, pathway credited, confetti |

- **Page transition:** fade + 8px rise, 200ms. Keep the existing `PageTransition`, with the distance reduced from 24px.
- **Scroll reveal (`AnimatedSection`):** marketing pages only (home, landing). Stagger at most 6 items, 40ms each. Never on catalog, jobs or dashboards.
- **Progress changes** animate their width so learners *see* progress happen.
- **Confetti** (kept from today) is reserved for course completion, certificate, pathway credit and badge.
- Under `prefers-reduced-motion: reduce`, all transforms become opacity-only and confetti is replaced by a static illustration.

---

## 6. Iconography & imagery

- **One icon set: `lucide-react`.** Font Awesome and `react-icons` are removed gradually.
  - Size 20px (UI) / 16px (inline) / 24px (feature tiles). Stroke 1.75.
  - Icon-only buttons need an `aria-label` and a tooltip.
- **No emoji as icons** (🔖, ✅ …). Emoji are allowed in user content and celebratory copy only.
- **Course images:** 16:9, `object-fit: cover`, AVIF/WebP with a fallback, a `loading="lazy"` attribute and a skeleton while loading.
- **Company/provider logos:** 32–40px in a neutral rounded square. Never stretched.
- **City images:** keep the existing `assets/jobpage/*.png`. All new ones use the same 4:3 crop.
- **Illustrations:** flat, 2-tone using the section accent + neutrals. Large animated GIFs are replaced by static images, or Lottie when motion matters.

---

## 7. Components (spec for `src/components/ui`)

Each component has: default · hover · focus-visible · active · disabled · loading states, and is documented with usage examples.

| Component | Key rules |
|---|---|
| **Button** | Variants: `primary` (accent-700 fill), `secondary` (white + border), `ghost`, `danger`, `link`. Sizes sm 36 / md 44 / lg 52px. One primary per view. Verb labels ("Start test", not "Submit"). Loading shows a spinner and keeps the width. |
| **Input / Select / Textarea** | Label always visible above (no placeholder-as-label). Helper text below; error in danger colour + icon + text. 44px height. |
| **Card** | White surface, 1px `--n-200` border, `shadow-xs`, radius lg. Whole-card links use one `<a>` with an expanded hit area, not `onClick` on a div. |
| **CourseCard** | 16:9 image → provider logo + name → title (2 lines max) → skills (max 3 chips) → meta row: level · duration · rating. Pathway status chip in the top-left when relevant. |
| **JobCard** | Company logo, title, company · city · mode chip, salary (₹ en-IN with period), **affordability chip** (§2.5) with a "Why?" popover, badge-match chip, apply-by date. |
| **Chip / StatusChip** | Icon + text, always. Caption type. Colours from §2.5. |
| **Progress** | Linear bar (course progress, 8px tall, rounded) and ring (dashboard). Always paired with a text percentage. |
| **Stepper / PathwayTimeline** | Vertical on mobile, horizontal on desktop. Each step: number/icon, title, duration, status chip. Credited steps show their method ("Credited via test"). A "You saved ~N weeks" summary on top. |
| **Tabs** | Underline style, accent-700 indicator. Arrow keys move between tabs (Radix). Synced to the URL (`?tab=`). |
| **Dialog / Sheet** | Radix-based: focus trap, Escape closes, `aria-labelledby`. Bottom sheet on mobile, centred modal ≥ md. |
| **Toast** | Replaces every `alert()`. Bottom-centre on mobile, bottom-right on desktop. Auto-dismiss in 5s except errors. |
| **Skeleton** | Matches the final layout shape. Shimmer is disabled under reduced motion. Shown if loading takes more than 150ms. |
| **EmptyState** | Illustration + one-line explanation + a primary action ("No applications yet — Explore jobs"). |
| **Money** | `Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0})` → **₹1,25,000**. Monthly by default; "/mo" or "/yr" suffix always shown. Compact form ₹1.2L / ₹12L for cards. |
| **DeadlineTimer** | Counts down to `dueAt`. Neutral when > 24h, warning when < 24h, danger when < 2h. Announced to screen readers at thresholds only (not every second). |
| **AffordabilityPanel** | In-hand salary (estimated) vs. city expense for the chosen lifestyle, category breakdown bar, surplus/shortfall, "How we calculate" link. |
| **FeedbackList** (simulator) | One row per failed check: what went wrong → why → **"Revise: <lesson>"** link (accent-700). Passed checks are collapsed. |
| **CertificateView / BadgeView** | Printable A4 landscape certificate; badge as a circular emblem with field + level. Both carry a verify URL + QR. |
| **CodeEditor** | Monaco, lazy-loaded, JetBrains Mono 14px, light/dark theme from tokens, Run and Submit buttons, a test-results panel. |

---

## 8. Page patterns

- **AppShell:**
  - Top header at lg and above: logo · Explore · Learn · Simulator · Jobs · Tools · Notes · avatar.
  - Below lg: compact header + **bottom dock** (Home, Explore, Jobs, Tools, Profile). Labels stay visible; never hide them with `font-size: 0`.
- **Section hero band:** accent gradient (§2.4), overline + h1 + one sentence + max 2 CTAs. 160–240px tall, not full-screen, except on Home.
- **Catalog (`/explore`):** sticky search + filter bar (filters open in a bottom sheet on mobile), horizontal course rows, then a results grid. Skeleton rows while loading.
- **Course page:** hero (title, provider, skills, level, duration) + **sticky enroll card** on the right (bottom bar on mobile), then About → Skills → Syllabus accordion → Certificate preview → Related courses.
- **Lesson player (focus layout):**
  - Header reduced to course title + progress + exit.
  - Collapsible outline on the left (drawer on mobile); content in the centre at max 70ch for text, 16:9 for video.
  - **Previous / Mark complete & Next** bar fixed at the bottom.
- **Specialization + Hybrid Pathway:** hero → PathwayTimeline with status chips → "Already know some of this?" card that opens the setup wizard (one question per step, with a progress indicator).
- **Assessment:** distraction-free; question counter + timer at the top; one question per screen on mobile; a review screen before submit. Results show the score, pass/fail, a per-module breakdown and next actions.
- **Simulator workspace:**
  - Two panes at lg and above: **Brief** (scenario, deliverables, deadline) on the left and **Workspace** (editor/document/choices) on the right.
  - Tabs on mobile.
  - After submission the FeedbackList appears in place.
- **Jobs:** filter rail (sheet on mobile) + list of JobCards. The top banner shows the user's city + lifestyle with an "Edit" control, so it's always clear *what* "Recommended" is based on.
- **Expense dashboard:** city picker + lifestyle toggle → six category tiles → breakdown chart → compare (up to 3 cities) → "salary needed" calculator. The source and last-updated date sit under every chart.
- **Recruiter / Admin:** dense, table-first, neutral palette, no hero gradients, no scroll animations.

---

## 9. Content & voice

- **Tone:** encouraging, plain, direct. Use "you". Short sentences. Use the words Indian students already use: "fresher", "CTC", "LPA", "in-hand", "stipend", "placement".
- **Money:** always ₹ with en-IN grouping and a period (₹45,000/mo, ₹6.5 LPA). Say "estimated in-hand" whenever tax maths is involved.
- **Dates:** `12 Oct 2026`; deadlines relative + absolute ("Due in 5 h · 12 Oct, 6:00 PM").
- **Buttons** are verbs: *Start course*, *Take the test*, *Submit task*, *Apply now*, *Revise lesson*.
- **Errors** say what happened + what to do: "Couldn't upload your resume. Check your connection and try again."
- **Failure is framed as a path forward:** a failed pre-assessment says "This course stays in your pathway — here's what to focus on", not "You failed".

---

## 10. Accessibility checklist (every screen)

- [ ] Contrast ≥ 4.5:1 for text, ≥ 3:1 for large text, icons and focus rings
- [ ] Everything works with keyboard alone; visible `:focus-visible` ring (2px `--brand-400`, 2px offset)
- [ ] Semantic HTML: real `<button>`/`<a>`, landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page
- [ ] Every input has a `<label>`; errors linked via `aria-describedby`
- [ ] Images have meaningful `alt` (decorative ones use `alt=""`)
- [ ] Dialogs trap focus, close on Escape, and return focus to the trigger
- [ ] Status is not conveyed by colour alone (icon + text)
- [ ] Timers and live scores use polite `aria-live`, without per-second spam
- [ ] Camera/proctoring explains why the camera is needed and how to continue if it is refused
- [ ] Charts have a text summary or data table alternative
- [ ] Touch targets ≥ 44×44px; nothing breaks at 200% zoom or at 360px width

---

## 11. Implementation rules (for code review)

1. **No raw colours, sizes or shadows in components.** Use tokens or Tailwind theme classes.
2. **No inline `style={{…}}` for static styling.** Inline styles are only for truly dynamic values (e.g. a progress width).
3. **No JS hover handlers** (`onMouseEnter` mutating styles). Use CSS `:hover`.
4. Build new UI from `components/ui` first. If a variant is missing, extend the component rather than forking it.
5. Every data view ships with skeleton, empty and error states.
6. Every new screen is checked at 360px, 768px and 1280px, and with the keyboard, before review.

```css
/* src/styles/tokens.css — excerpt */
:root {
  --brand-500:#1181c8; --brand-600:#0b6aa6; --brand-700:#0a5687; --brand-deep:#004aad;
  --n-0:#fff; --n-50:#f8fafc; --n-100:#f1f5f9; --n-200:#e2e8f0; --n-600:#475569; --n-900:#0f172a;
  --surface:var(--n-0); --bg:var(--n-50); --text:var(--n-900); --text-muted:var(--n-600); --border:var(--n-200);
  --radius-md:10px; --radius-lg:14px; --radius-xl:20px;
  --font-sans:"Plus Jakarta Sans","Noto Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,monospace;
  --accent-500:var(--brand-500); --accent-700:var(--brand-600);
}
[data-section="learn"]     { --accent-500:#7c6bff; --accent-700:#4f3fd1; }
[data-section="simulator"] { --accent-500:#c026d3; --accent-700:#a21caf; }
[data-section="jobs"]      { --accent-500:#0ea5e9; --accent-700:#0369a1; }
[data-section="tools"]     { --accent-500:#f97316; --accent-700:#c2410c; }
[data-section="notes"]     { --accent-500:#0d9488; --accent-700:#0f766e; }
[data-section="profile"]   { --accent-500:#7c3aed; --accent-700:#6d28d9; }
[data-section="recruiter"] { --accent-500:#1e293b; --accent-700:#1e293b; --accent-gold:#fbbf24; }
```

### Do / Don't
| Do | Don't |
|---|---|
| Neutral cards with one accent CTA | Gradient backgrounds behind every section |
| Glass on hero and header only | Glass on course/job cards and forms |
| Status chips with icon + text | Green/red dots only |
| "Recommended · +₹8,400/mo" with a "Why?" popover | "Affordable ✅" with no explanation |
| Skeleton that mirrors the layout | Full-page spinner |
| Toast or inline error | `alert()` |
| lucide icons, 20px | Mixing Font Awesome, react-icons and emoji |

## Goals

Six fixes spanning the create flow, explore page, and journey completion.

---

## 1. Fix "Next: make your first post" button

**Root cause:** `src/routes/create.journey.tsx` registers route `/create/journey` and acts as the *parent* of `src/routes/create.journey.first-post.tsx` (`/create/journey/first-post`). Because the parent renders its own form UI instead of `<Outlet />`, the child route matches but has nowhere to render — the screen looks stuck.

**Fix:** split the parent into a layout + index pair.
- Rename `src/routes/create.journey.tsx` → `src/routes/create.journey.index.tsx` (keeps the form, route stays `/create/journey/`).
- Create a new `src/routes/create.journey.tsx` whose `component` is just `() => <Outlet />` (registered at `/create/journey`, acts as layout for `/first-post`).

The first-post page already uses `Composer` (same component as Add update), so no UI work needed beyond ensuring the route mounts.

---

## 2. Add optional "Expected timeline" to Start a Journey page

In `src/routes/create.journey.index.tsx` (the renamed form), add a labeled text input "Expected timeline (optional)" placed BEFORE the Reminder schedule section. Examples placeholder: "12 weeks", "ongoing", "by July". Store in the draft payload sessionStorage under `timeline`, and pass through to the created `Journey` in `create.journey.first-post.tsx` (replace hardcoded `timeline: "ongoing"` with `draft.timeline || "ongoing"`).

---

## 3. Back from "Start a Journey" page should respect entry point

When user enters `/create/journey` from `/profile` (the "+ New" link), tapping the back chevron currently goes to `/create` (the chooser). Change behavior:
- Replace the back `<Link to="/create">` in the journey form with a `<button>` that calls `history.back()` so it returns to whichever page the user came from (profile or the create chooser).

---

## 4. Explore page: show owner + hide current user's journeys

In `src/routes/explore.tsx`:
- Filter out journeys where `journey.owner === CURRENT_USER.username` from `filteredJourneys`.

In `src/components/JourneyProgressCard.tsx`:
- Add a small header row above the title: avatar + `@owner` + a compact "Follow"/"Following" pill for the *account* (using the same `toggleFollow` already wired to the journey id — we treat following the journey as following the account for this mock).
- Keep the existing "Follow along" button on the journey itself.

---

## 5. Customizable highlight reel on journey completion

Update `src/routes/journey.$id.complete.tsx` so the user can curate the reel before sharing:
- Show all journey posts that have `url` (photos AND video posters), each as a thumbnail with a tap-to-toggle selected state. Default: first 5 photos selected (current behavior).
- Allow reordering via simple up/down arrows on each selected thumb (keep UI small; no drag-drop library).
- Keep caption textarea.
- On Share: store the chosen image URLs on the journey.

**Data model** — extend `Journey` in `src/data/mock.ts`:
```ts
highlight?: { images: string[]; caption: string };
```

**State** — extend `src/state/AppState.tsx`:
- Change `completeJourney(id)` → `completeJourney(id, highlight?: { images: string[]; caption: string })` and write it onto the journey object inside `setJourneys`.

Continue adding a regular completion post to the timeline (as today) so it shows in feed/timeline.

---

## 6. Display highlight reel as a bar on the journey page

In `src/routes/journey.$id.index.tsx`, when `j.highlight?.images.length`, render a horizontally scrollable strip at the very top of `<main>` (above the cover image), styled like an Instagram stories row: rounded thumbnails in a gradient ring, label "Highlights" above. Tapping a thumb opens the existing `PostDetailModal` with a synthetic photo post (no extra route).

---

## Files touched

- `src/routes/create.journey.tsx` (new layout: `<Outlet />`)
- `src/routes/create.journey.index.tsx` (renamed form, adds Timeline field, history.back)
- `src/routes/create.journey.first-post.tsx` (use `draft.timeline`)
- `src/routes/explore.tsx` (filter out current user)
- `src/components/JourneyProgressCard.tsx` (owner row + follow account pill)
- `src/routes/journey.$id.complete.tsx` (curate highlight UI)
- `src/routes/journey.$id.index.tsx` (highlights bar at top)
- `src/state/AppState.tsx` (`completeJourney` accepts highlight)
- `src/data/mock.ts` (`Journey.highlight` type)

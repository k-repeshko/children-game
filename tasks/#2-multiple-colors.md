# Multiple colors

## Goal
Make rounds more varied and harder: shapes come in several colors, and the child sorts each shape onto the target of its own color.

## Behavior
- Settings get a new field, number of colors (`colors`), alongside `rewardSeconds` and `shapes`. It is validated and saved like the other settings; invalid stored data falls back to the default.
- `colors` ranges from 1 to 4, and must not exceed `shapes`. Settings validation enforces both.
- A round picks `colors` distinct colors at random from the rainbow palette.
- Every chosen color appears on at least one shape; the remaining shapes get random colors from the chosen set.
- The game shows one target line per color, each in its color, all on the side opposite the shapes.
- Targets are stacked evenly along the side, in a random order each round.
- Target height shrinks as the number of targets grows, so all targets always fit on the board with gaps between them. With 1 target it keeps its current size.
- A shape counts as delivered only when it is dropped on the target of its own color.
- A shape dropped on a wrong-color target (or anywhere else) just stays where it was dropped. There is no feedback; the child has to drag it to the right target.
- When a shape overlaps more than one target, it is matched to the target with the largest overlap area.
- The round completes when all shapes are delivered, as today.
- Shapes still start on the side opposite the targets, in the 3-column grid without intersecting.
- With `colors` = 1 the game behaves exactly as it does now.

## Acceptance criteria
- Settings page lets me set the number of colors; the value persists across reloads.
- With N colors, the game shows exactly N targets with N different colors.
- With 4 colors on a small screen, all targets are fully visible and do not overlap.
- Every shape's color matches one of the targets.
- Dropping a shape on its own-color target hides it; dropping it on another color's target does not.
- The round ends and the reward plays only after all shapes are delivered.
- `npm run build` and `npm run lint` pass; README is updated for the new setting and rules.

## Out of scope
- Different shape forms (only colors vary).
- Sounds or animations for wrong drops.

## Implementation notes
- Target stack: 1 target keeps the old 280px height; 2+ targets share a 420px stack (24px gaps), capped to board height minus 24px margins, so each target shrinks as the count grows (e.g. 198/124/87px on a tall board). Logic in `src/logic/targets.logic.ts`.
- `GameRound` now holds `targetColors` (stack order, shuffled) and `shapeColors`; `createGameRound(shapes, colors)`.
- Settings saved before `colors` existed are loaded as `colors = 1` instead of being reset to defaults. Saving with `colors > shapes` is rejected with an error message; lowering Shapes below Colors needs Colors lowered too.
- Verified: build, lint, headless checks (color assignment over many random rounds, no target overlap/off-board at several heights, largest-overlap matching), and in the browser at 1024x600 with 4 colors / 6 shapes (targets visible, wrong-color drop stays, right-color drop hides). Not verified: real touch on iPad, full round → reward flow, 1-color visually (same code path).

# Match by form

## Goal
Make forms matter: the child can sort shapes by form, by color, or by both, so the game teaches telling forms apart (circle, square, triangle, star). Follow-up to tasks #2 (colors) and #3 (forms).

## Behavior

### Setting
- Settings get a new field, `match`, shown as a selector with three options: Color, Shape, Color & Shape. Default: Color.
- It is validated and saved like the other settings; invalid stored data falls back to the default, and settings saved before `match` existed load as Color.
- With Color the game behaves exactly as it does now (tasks #2 and #3): colored line targets, forms decorative.

### Targets by mode
- **Color:** one colored line target per color, as in task #2.
- **Shape:** one target per chosen form. Each target is a gray dashed outline (silhouette slot) of its form. Colors of the shapes are decorative.
- **Color & Shape:** each target is a dashed outline of a form, drawn in the color of its pair. A target exists for a specific (form, color) pair.
- In Shape and Color & Shape modes targets are square slots, drawn in the same form geometry as the shapes (`src/logic/shapeForms.logic.ts`). They are stacked evenly along the side opposite the shapes, in random order each round, and sized as in task #2: the slot side equals the per-target stack height, so the slot shrinks as the number of targets grows, and is also capped by the board width.
- The number of targets is at most 4 in every mode, so the stack always fits on small screens as in task #2.

### Round generation (every round must be finishable)
- **Shape:** the round picks `forms` distinct forms. Every chosen form appears on at least one shape (the remaining shapes get random chosen forms). Colors are picked as in task #2, every chosen color on at least one shape.
- **Color & Shape:** the round picks N = max(`colors`, `forms`) distinct (form, color) pairs from the chosen colors and forms, such that every chosen color and every chosen form is used in at least one pair. Every pair gets at least one shape; the remaining shapes get random pairs from those N. So every shape has exactly one matching target and every target receives at least one shape.
- In Color & Shape mode the chosen forms and colors are the ones used in the pairs, so no shape ever has a form/color combination without a target.

### Matching and play
- A shape counts as delivered only when it is dropped on its own target: in Color mode the target of its color, in Shape mode the target of its form, in Color & Shape the target of its (form, color) pair.
- A shape dropped on a wrong target (or anywhere else) just stays where it was dropped, with no feedback.
- When a shape overlaps more than one target, it is matched to the target with the largest overlap area. The overlap check keeps using bounding boxes, not the exact outlines.
- The round completes when all shapes are delivered, as today.

### Validation
- Shape mode requires `forms` ≤ `shapes`.
- Color & Shape mode requires max(`colors`, `forms`) ≤ `shapes` (and `colors` ≤ `shapes` as today).
- Color mode keeps today's rules: `forms` may exceed `shapes`.
- Validation runs when saving settings and shows an error message in the same way as the `colors` ≤ `shapes` error. Switching to Shape or Color & Shape with too few shapes is rejected until Shapes is raised or Forms/Colors lowered.
- Stored settings that break these rules on load (e.g. edited by hand) fall back to the defaults.

## Acceptance criteria
- Settings page has a Match selector with Color, Shape, Color & Shape; the choice persists across reloads. Old saved settings load as Color.
- Color mode plays exactly as before.
- Shape mode: N distinct form targets are shown as gray dashed silhouettes; dropping a shape on the target of its form hides it, on another form's target it stays, regardless of colors.
- Color & Shape mode: targets are dashed silhouettes in their colors; a shape hides only on the target with the same form and the same color.
- Over many random rounds in every mode, every shape has a matching target and every target has at least one shape, so the round can always be finished.
- Targets are fully visible and do not overlap with 4 targets on a small screen; each target's form is recognizable.
- Saving settings with too few shapes for the selected mode is rejected with an error message.
- `npm run build` and `npm run lint` pass; README is updated for the new setting and rules.

## Out of scope
- Sounds or animations for wrong drops.
- New forms beyond the four from task #3.
- Matching by form with more than 4 targets.

## Implementation notes
- Targets are `{color, form}` with `null` meaning "any"; one `targetAccepts` check covers all three modes. Color mode keeps line targets (`form: null`); other modes render dashed slots.
- Slot width cap: 25% of board width (`TARGET_SLOT_MAX_WIDTH_RATIO`); the shape grid reserves the actual target width instead of the fixed line width. Neutral slot color `#9a9a9a`.
- Shape mode also requires `colors` ≤ `shapes` (colors are still spread over shapes), i.e. needs max(colors, forms) shapes.
- Added a `SelectField` to the UI kit for the Match selector.
- Round generation checked headlessly over all setting combinations (every shape has exactly one target, every target a shape). Not checked visually in a browser/on iPad.

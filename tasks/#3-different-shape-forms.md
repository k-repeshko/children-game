# Different shape forms

## Goal
Make rounds more varied: shapes come in several forms (square, circle, triangle, ...), not only squares, so the game looks richer and the child gets to see different forms.

## Behavior
- A new set of shape forms is defined in game constants. The initial set is: square, circle, triangle, star.
- Every shape is rendered in its form and its color (colors work as in task #2).
- Settings get a new field, number of forms (`forms`), alongside `rewardSeconds`, `shapes` and `colors`. It is validated and saved like the other settings; invalid stored data falls back to the default, and settings saved before `forms` existed load as `forms` = 1.
- `forms` ranges from 1 to 4 (the size of the form set), default 1. It has no relation to `shapes` or `colors`, so it may exceed `shapes`.
- A round picks `forms` distinct forms at random from the set; each shape's form is then picked at random from those, independently per shape. A form is not guaranteed to appear: with few shapes some chosen forms may not show up (unlike colors).
- With `forms` = 1 the round uses one random form, so it may be a circle, not always a square.
- Forms are purely visual: the form does not affect which target a shape belongs to. Matching still depends on color only.
- All forms fit inside the same square box, so the grid layout, the hit area, dragging and the target-overlap check work exactly as for squares today (the overlap check keeps using the bounding box, not the exact outline).
- Forms are drawn so they stay recognizable at every shape size the grid produces, including the smallest on small screens.
- The enlarged invisible hit area stays square for every form, so thin parts of a form (star points) are easy to grab.
- Targets stay as they are now (colored lines).

## Acceptance criteria
- Settings page lets me set the number of forms; the value persists across reloads.
- With `forms` > 1 and enough shapes, a round can show more than one form; no round ever shows a form outside the chosen ones. Over several rounds all four forms appear.
- Each shape's fill matches its color, and a shape of any form hides when dropped on the target of its own color and stays when dropped elsewhere.
- Dragging works the same for all forms, including grabbing a star or triangle near its edge.
- Forms look correct and do not overlap in the grid on a small screen with the maximum number of shapes.
- Apart from the shape outlines, the game plays exactly as before.
- `npm run build` and `npm run lint` pass; README is updated for the new setting and forms.

## Out of scope
- Matching by form (targets keyed to forms) or any form-based rules; forms stay decorative.
- Guaranteeing that every chosen form appears in a round.
- Sounds or animations for forms.
- Changes to target lines.

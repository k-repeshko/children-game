# Multiple shapes

## Description
SettingsPage.tsx can specfy number of shapes.
Currently game shows only 1 shape. Game should show number of shapes using that setting.
Shapes must be shown in a grid: 3x3.
If number of shapes are less then 9, then the grid will not be full.
Examples:
    2 shapes - 1 row
    3 shapes - 1 row
    4 shapes - 2 rows
    8 shapes - 3 rows

## Notes
- Now shapes are always in the opposite of target, we need to preserve that behaviour
- All shapes must be of the same color
- Shapes must not intersect on the start, so they grid must have gap between shapes

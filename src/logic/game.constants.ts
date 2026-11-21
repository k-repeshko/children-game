export const SHAPE_SIZE = 120
export const TARGET_WIDTH = 28
export const TARGET_HEIGHT = 280
export const BOARD_EDGE_GAP = 48
export const DRAG_HIT_AREA_PADDING = 24

export const REWARD_STEP_SECONDS = 20

export const SHAPE_GRID_COLUMNS = 3
export const SHAPE_GRID_GAP = 24
// Minimum free space kept between the shape grid and the target line.
export const SHAPE_GRID_TARGET_CLEARANCE = 24

// Combined height of the stacked targets when there are 2+ (1 target uses TARGET_HEIGHT).
export const TARGET_STACK_HEIGHT = 420
export const TARGET_GAP = 24
// Minimum free space above and below the target stack on short boards.
export const TARGET_STACK_MARGIN = 24

// Decorative shape forms; all are drawn inside the same square box.
export const SHAPE_FORMS = ['square', 'circle', 'triangle', 'star'] as const
export type ShapeForm = (typeof SHAPE_FORMS)[number]

// What a shape must match to be delivered: its color, its form, or both.
export const MATCH_MODES = ['color', 'shape', 'both'] as const
export type MatchMode = (typeof MATCH_MODES)[number]

// Square slot targets (shape / both modes) are at most this share of the board width.
export const TARGET_SLOT_MAX_WIDTH_RATIO = 0.25
export const TARGET_SLOT_NEUTRAL_COLOR = '#9a9a9a'
// Slot targets count a drop only when the shape covers this share of the smaller of the two.
export const TARGET_SLOT_MIN_COVERAGE = 0.5

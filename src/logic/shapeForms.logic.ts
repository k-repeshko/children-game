// Geometry for shape forms, drawn in a 100x100 box. Triangle and star are inset by half of
// SHAPE_FORM_STROKE so the rounded outline stays inside the box.
export const SHAPE_FORM_STROKE = 8

export const TRIANGLE_POINTS = '50,10 91,86 9,86'

function getStarPoints(): string {
  const outer = 43
  const inner = 20
  const points: string[] = []
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI * i) / 5
    points.push(
      `${(50 + radius * Math.sin(angle)).toFixed(1)},${(53 - radius * Math.cos(angle)).toFixed(1)}`,
    )
  }
  return points.join(' ')
}

export const STAR_POINTS = getStarPoints()

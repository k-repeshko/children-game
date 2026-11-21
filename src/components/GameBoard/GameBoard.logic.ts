import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefCallback } from 'react'
import {
  DRAG_HIT_AREA_PADDING,
  SHAPE_SIZE,
  TARGET_SLOT_NEUTRAL_COLOR,
  type MatchMode,
  type ShapeForm,
} from '../../logic/game.constants'
import { targetAccepts, type Side, type Target } from '../../logic/round.logic'
import { getShapeGridLayout, type Point } from '../../logic/shapeGrid.logic'
import {
  findOverlappedTarget,
  getTargetRects,
  type Rect,
  type Size,
} from '../../logic/targets.logic'

type ShapeState = {
  center: Point
  delivered: boolean
}

export type UseGameBoardLogicInput = {
  targets: Target[]
  match: MatchMode
  shapeColors: string[]
  shapeForms: ShapeForm[]
  shapeCount: number
  shapeSide: Side
  targetSide: Side
  resetToken: number
  disabled: boolean
  onSuccess: () => void
}

export type GameBoardShapeProps = {
  key: number
  form: ShapeForm
  style: CSSProperties
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void
}

export type GameBoardProps = {
  boardRef: RefCallback<HTMLElement>
  targets: { key: number; form: ShapeForm | null; style: CSSProperties }[]
  shapes: GameBoardShapeProps[]
  hitAreaStyle: CSSProperties
  isDisabled: boolean
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getShapeRect(center: Point, size: number): Rect {
  return {
    left: center.x - size / 2,
    top: center.y - size / 2,
    width: size,
    height: size,
  }
}

function getEventBoardCoordinates(
  event: ReactPointerEvent<HTMLButtonElement>,
  boardElement: HTMLElement,
): Point {
  const boardRect = boardElement.getBoundingClientRect()

  return {
    x: event.clientX - boardRect.left,
    y: event.clientY - boardRect.top,
  }
}

export function useGameBoardLogic({
  targets: roundTargets,
  match,
  shapeColors,
  shapeForms,
  shapeCount,
  shapeSide,
  targetSide,
  resetToken,
  disabled,
  onSuccess,
}: UseGameBoardLogicInput): GameBoardProps {
  const [boardElement, setBoardElement] = useState<HTMLElement | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 })
  const [boardSize, setBoardSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [shapes, setShapes] = useState<ShapeState[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const targetCount = roundTargets.length
  const targetRects = useMemo(
    () => getTargetRects(targetCount, targetSide, boardSize, match !== 'color'),
    [targetCount, targetSide, boardSize, match],
  )
  const targetWidth = targetRects[0]?.width ?? 0

  const layout = useMemo(
    () => getShapeGridLayout(shapeCount, shapeSide, boardSize, targetWidth),
    [shapeCount, shapeSide, boardSize, targetWidth],
  )
  const shapeSize = layout.size

  useEffect(() => {
    setShapes(layout.centers.map((center) => ({ center, delivered: false })))
    setActiveIndex(null)
  }, [layout, resetToken])

  useEffect(() => {
    if (!boardElement) {
      return
    }

    const updateBoardSize = () => {
      const rect = boardElement.getBoundingClientRect()
      const width = rect.width > 0 ? rect.width : window.innerWidth
      const height = rect.height > 0 ? rect.height : window.innerHeight

      setBoardSize({
        width,
        height,
      })

      if (rect.width === 0 || rect.height === 0) {
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current)
        }
        rafIdRef.current = window.requestAnimationFrame(updateBoardSize)
      } else if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }

    updateBoardSize()
    const resizeObserver = new ResizeObserver(updateBoardSize)
    resizeObserver.observe(boardElement)
    window.addEventListener('resize', updateBoardSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateBoardSize)
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [boardElement])

  const boardRef = useCallback<RefCallback<HTMLElement>>((element) => {
    setBoardElement(element)
  }, [])

  const onShapePointerDown = useCallback(
    (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
      const shape = shapes[index]
      if (disabled || !boardElement || !shape || shape.delivered || activeIndex !== null) {
        return
      }

      event.currentTarget.setPointerCapture(event.pointerId)

      const pointer = getEventBoardCoordinates(event, boardElement)
      dragOffsetRef.current = {
        x: pointer.x - shape.center.x,
        y: pointer.y - shape.center.y,
      }
      setActiveIndex(index)
    },
    [activeIndex, boardElement, disabled, shapes],
  )

  const onShapePointerMove = useCallback(
    (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (disabled || activeIndex !== index || !boardElement) {
        return
      }

      const pointer = getEventBoardCoordinates(event, boardElement)
      const nextCenter: Point = {
        x: clamp(
          pointer.x - dragOffsetRef.current.x,
          shapeSize / 2,
          boardSize.width - shapeSize / 2,
        ),
        y: clamp(
          pointer.y - dragOffsetRef.current.y,
          shapeSize / 2,
          boardSize.height - shapeSize / 2,
        ),
      }

      // A shape is delivered only when its largest overlap is with its own target.
      const overlapped = findOverlappedTarget(getShapeRect(nextCenter, shapeSize), targetRects)
      const reachedTarget =
        overlapped !== null &&
        targetAccepts(roundTargets[overlapped], shapeColors[index], shapeForms[index])
      setShapes((current) =>
        current.map((shape, shapeIndex) =>
          shapeIndex === index
            ? { center: nextCenter, delivered: reachedTarget }
            : shape,
        ),
      )

      if (reachedTarget) {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
        setActiveIndex(null)

        const allDelivered = shapes.every(
          (shape, shapeIndex) => shapeIndex === index || shape.delivered,
        )
        if (allDelivered) {
          onSuccess()
        }
      }
    },
    [activeIndex, boardElement, boardSize, disabled, onSuccess, roundTargets, shapeColors, shapeForms, shapeSize, shapes, targetRects],
  )

  const onShapePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      setActiveIndex(null)
    },
    [],
  )

  const shapeProps = useMemo<GameBoardShapeProps[]>(
    () =>
      shapes.flatMap((shape, index) =>
        shape.delivered
          ? []
          : [
              {
                key: index,
                form: shapeForms[index] ?? 'square',
                style: {
                  width: shapeSize,
                  height: shapeSize,
                  left: shape.center.x - shapeSize / 2,
                  top: shape.center.y - shapeSize / 2,
                  color: shapeColors[index],
                },
                onPointerDown: (event) => onShapePointerDown(index, event),
                onPointerMove: (event) => onShapePointerMove(index, event),
                onPointerUp: onShapePointerUp,
              },
            ],
      ),
    [shapes, shapeSize, shapeColors, shapeForms, onShapePointerDown, onShapePointerMove, onShapePointerUp],
  )

  const targets = useMemo(
    () =>
      targetRects.map((rect, index) => ({
        key: index,
        form: roundTargets[index].form,
        style: {
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
          // Line targets are filled with their color; slots draw a dashed outline in it.
          ...(roundTargets[index].form === null
            ? { backgroundColor: roundTargets[index].color ?? undefined }
            : { color: roundTargets[index].color ?? TARGET_SLOT_NEUTRAL_COLOR }),
        },
      })),
    [targetRects, roundTargets],
  )

  const hitAreaStyle = useMemo<CSSProperties>(() => {
    const padding = DRAG_HIT_AREA_PADDING * (shapeSize / SHAPE_SIZE)
    return {
      top: -padding,
      right: -padding,
      bottom: -padding,
      left: -padding,
    }
  }, [shapeSize])

  return {
    boardRef,
    targets,
    shapes: shapeProps,
    hitAreaStyle,
    isDisabled: disabled,
  }
}

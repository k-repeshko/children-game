import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefCallback } from 'react'
import {
  BOARD_EDGE_GAP,
  DRAG_HIT_AREA_PADDING,
  SHAPE_SIZE,
  TARGET_HEIGHT,
  TARGET_WIDTH,
} from '../../logic/game.constants'
import type { Side } from '../../logic/round.logic'

type Point = {
  x: number
  y: number
}

type Rect = {
  left: number
  top: number
  width: number
  height: number
}

type Size = {
  width: number
  height: number
}

export type UseGameBoardLogicInput = {
  color: string
  shapeSide: Side
  targetSide: Side
  resetToken: number
  disabled: boolean
  onSuccess: () => void
}

export type GameBoardProps = {
  boardRef: RefCallback<HTMLElement>
  targetStyle: CSSProperties
  shapeStyle: CSSProperties
  hitAreaStyle: CSSProperties
  isDisabled: boolean
  onShapePointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onShapePointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onShapePointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function intersects(a: Rect, b: Rect): boolean {
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top
  )
}

function getInitialPosition(shapeSide: Side, size: Size): Point {
  const x =
    shapeSide === 'left'
      ? BOARD_EDGE_GAP + SHAPE_SIZE / 2
      : size.width - BOARD_EDGE_GAP - SHAPE_SIZE / 2

  return {
    x,
    y: size.height / 2,
  }
}

function getTargetRect(targetSide: Side, size: Size): Rect {
  const horizontalPosition =
    targetSide === 'left' ? BOARD_EDGE_GAP : size.width - BOARD_EDGE_GAP - TARGET_WIDTH

  return {
    left: horizontalPosition,
    top: (size.height - TARGET_HEIGHT) / 2,
    width: TARGET_WIDTH,
    height: TARGET_HEIGHT,
  }
}

function getShapeRect(center: Point): Rect {
  return {
    left: center.x - SHAPE_SIZE / 2,
    top: center.y - SHAPE_SIZE / 2,
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
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
  color,
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
  const [shapeCenter, setShapeCenter] = useState<Point>(() => ({
    x: 0,
    y: 0,
  }))
  const [isDragging, setIsDragging] = useState(false)

  const targetRect = useMemo(
    () => getTargetRect(targetSide, boardSize),
    [targetSide, boardSize],
  )

  const verifySuccess = useCallback(
    (nextCenter: Point) => {
      if (!disabled && intersects(getShapeRect(nextCenter), targetRect)) {
        onSuccess()
      }
    },
    [disabled, onSuccess, targetRect],
  )

  useEffect(() => {
    const nextPosition = getInitialPosition(shapeSide, boardSize)
    setShapeCenter(nextPosition)
    setIsDragging(false)
  }, [shapeSide, boardSize, resetToken])

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
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (disabled || !boardElement) {
        return
      }

      const targetElement = event.currentTarget
      targetElement.setPointerCapture(event.pointerId)

      const pointer = getEventBoardCoordinates(event, boardElement)
      dragOffsetRef.current = {
        x: pointer.x - shapeCenter.x,
        y: pointer.y - shapeCenter.y,
      }
      setIsDragging(true)
    },
    [boardElement, disabled, shapeCenter],
  )

  const onShapePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (disabled || !isDragging || !boardElement) {
        return
      }

      const pointer = getEventBoardCoordinates(event, boardElement)
      const nextCenter: Point = {
        x: clamp(
          pointer.x - dragOffsetRef.current.x,
          SHAPE_SIZE / 2,
          boardSize.width - SHAPE_SIZE / 2,
        ),
        y: clamp(
          pointer.y - dragOffsetRef.current.y,
          SHAPE_SIZE / 2,
          boardSize.height - SHAPE_SIZE / 2,
        ),
      }

      setShapeCenter(nextCenter)
      verifySuccess(nextCenter)
    },
    [boardElement, disabled, isDragging, boardSize, verifySuccess],
  )

  const onShapePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      setIsDragging(false)
    },
    [],
  )

  const shapeStyle = useMemo<CSSProperties>(
    () => ({
      width: SHAPE_SIZE,
      height: SHAPE_SIZE,
      left: shapeCenter.x - SHAPE_SIZE / 2,
      top: shapeCenter.y - SHAPE_SIZE / 2,
      backgroundColor: color,
    }),
    [shapeCenter, color],
  )

  const targetStyle = useMemo<CSSProperties>(
    () => ({
      width: targetRect.width,
      height: targetRect.height,
      left: targetRect.left,
      top: targetRect.top,
      backgroundColor: color,
    }),
    [targetRect, color],
  )

  const hitAreaStyle = useMemo<CSSProperties>(
    () => ({
      top: -DRAG_HIT_AREA_PADDING,
      right: -DRAG_HIT_AREA_PADDING,
      bottom: -DRAG_HIT_AREA_PADDING,
      left: -DRAG_HIT_AREA_PADDING,
    }),
    [],
  )

  return {
    boardRef,
    targetStyle,
    shapeStyle,
    hitAreaStyle,
    isDisabled: disabled,
    onShapePointerDown,
    onShapePointerMove,
    onShapePointerUp,
  }
}

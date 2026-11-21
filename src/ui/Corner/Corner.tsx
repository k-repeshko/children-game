import './Corner.scss'
import type { HTMLAttributes } from 'react'
import { classNames } from '../classNames'

export type CornerProps = HTMLAttributes<HTMLDivElement> & {
  position: 'top-left' | 'top-right'
}

export function Corner({ position, className, ...rest }: CornerProps) {
  return <div className={classNames('ui-corner', `ui-corner--${position}`, className)} {...rest} />
}

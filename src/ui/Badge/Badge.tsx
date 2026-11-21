import './Badge.scss'
import type { HTMLAttributes } from 'react'
import { classNames } from '../classNames'

export type BadgeProps = HTMLAttributes<HTMLDivElement>

export function Badge({ className, ...rest }: BadgeProps) {
  return <div className={classNames('ui-badge', className)} {...rest} />
}

import './Overlay.scss'
import type { HTMLAttributes } from 'react'
import { classNames } from '../classNames'

export type OverlayProps = HTMLAttributes<HTMLElement>

export function Overlay({ className, ...rest }: OverlayProps) {
  return <section className={classNames('ui-overlay', className)} {...rest} />
}

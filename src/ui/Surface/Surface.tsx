import './Surface.scss'
import type { HTMLAttributes } from 'react'
import { classNames } from '../classNames'

export type SurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section'
  padding?: 'md' | 'lg'
}

export function Surface({ as: Tag = 'div', padding = 'lg', className, ...rest }: SurfaceProps) {
  return (
    <Tag className={classNames('ui-surface', `ui-surface--padding-${padding}`, className)} {...rest} />
  )
}

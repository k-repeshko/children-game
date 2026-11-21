import './Page.scss'
import type { ReactNode } from 'react'
import { Surface } from '../Surface/Surface'

export type PageProps = {
  title: string
  actions?: ReactNode
  children: ReactNode
}

export function Page({ title, actions, children }: PageProps) {
  return (
    <Surface as="section" className="ui-page" aria-label={title}>
      <h1 className="ui-page__title">{title}</h1>
      {children}
      {actions ? <div className="ui-page__actions">{actions}</div> : null}
    </Surface>
  )
}

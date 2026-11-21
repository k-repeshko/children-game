import './FieldError.scss'
import type { ReactNode } from 'react'

export type FieldErrorProps = {
  children: ReactNode
}

export function FieldError({ children }: FieldErrorProps) {
  return (
    <p className="ui-field-error" role="alert">
      {children}
    </p>
  )
}

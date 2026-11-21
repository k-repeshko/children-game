import './Button.scss'
import type { ButtonHTMLAttributes } from 'react'
import { classNames } from '../classNames'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  shape?: 'pill' | 'circle'
  size?: 'md' | 'lg'
}

export function Button({
  shape = 'pill',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames('ui-button', `ui-button--${shape}`, `ui-button--${size}`, className)}
      {...rest}
    />
  )
}

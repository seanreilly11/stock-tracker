import React from 'react'
import Spinner from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'default' | 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

const Button = ({
  loading = false,
  variant = 'default',
  size = 'md',
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const base =
    'inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  const variants = {
    default:
      'border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)]',
    primary:
      'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink-2)]',
    ghost:
      'border-transparent bg-transparent text-[var(--ink-2)] hover:bg-[var(--paper-2)]',
    danger:
      'border-[var(--accent-line)] bg-transparent text-[var(--accent)] hover:bg-[var(--accent-soft)]',
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      type={type}
      {...rest}
    >
      {loading ? <Spinner size="small" /> : children}
    </button>
  )
}

export default Button

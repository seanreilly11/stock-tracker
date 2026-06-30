'use client'
import React, { HTMLInputTypeAttribute, InputHTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: (name: string, options: object) => object
  type: HTMLInputTypeAttribute
  name: string
  options: object
  errors: Record<string, { message?: string }>
}

const AuthInput = ({ register, name, type, options, errors, ...rest }: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  const hasError = Boolean(errors[name])

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          className={[
            'w-full rounded-md border px-3 py-2 text-sm bg-[var(--paper)] text-[var(--ink)]',
            'placeholder:text-[var(--ink-4)] outline-none',
            'focus:border-[var(--ink-3)] transition-colors',
            hasError ? 'border-[var(--accent)]' : 'border-[var(--rule)]',
            isPassword ? 'pr-10' : '',
          ].join(' ')}
          type={inputType}
          {...(register(name, options) as object)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink-2)]"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hasError && (
        <p className="text-xs text-[var(--accent)]">{errors[name]?.message}</p>
      )}
    </div>
  )
}

export default AuthInput

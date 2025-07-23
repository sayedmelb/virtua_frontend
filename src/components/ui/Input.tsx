import type React from "react"
import { cn } from "../../lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
}

export function Input({ label, error, icon, helperText, className, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          {icon && icon}
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          "w-full h-12 px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20",
          className,
        )}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

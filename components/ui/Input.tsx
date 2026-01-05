import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Optional Label */}
        {label && (
          <label 
            className="block text-sm font-bold text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Input Field */}
        <input
          type={type}
          className={`
            flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all
            file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-gray-400 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${error 
              ? 'border-red-500 focus-visible:ring-red-500 text-red-900 placeholder:text-red-300' 
              : 'border-gray-300 focus-visible:ring-[#06392F] focus-visible:border-[#06392F] text-gray-900'
            }
            ${className}
          `}
          ref={ref}
          {...props}
        />

        {/* Optional Error Message */}
        {error && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
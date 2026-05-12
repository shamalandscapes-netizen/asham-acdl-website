// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnChange?: boolean
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  private resetTimeout: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console
    console.error('ErrorBoundary caught an error:', error)
    console.error('Component stack:', errorInfo.componentStack)

    // Update state with error details
    this.setState({ error, errorInfo })

    // Call optional error handler (e.g., for Sentry, LogRocket)
    this.props.onError?.(error, errorInfo)

    // Optional: Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorTracking(error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnChange, resetKeys } = this.props
    const { hasError } = this.state

    // Auto-reset when resetKeys change (useful for route changes)
    if (hasError && resetOnChange && resetKeys) {
      const hasKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      )
      if (hasKeyChanged) {
        this.reset()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout)
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (!hasError) {
      return children
    }

    // Custom fallback provided
    if (fallback) {
      return fallback
    }

    // Default fallback UI
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="error-boundary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
        >
          <div className="max-w-lg w-full text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6"
            >
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Something went wrong
            </h2>

            {/* Message */}
            <p className="text-gray-500 mb-8 leading-relaxed">
              We apologize for the inconvenience. Our team has been notified and
              we're working to fix this issue.
            </p>

            {/* Error Details (dev only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 text-left"
              >
                <div className="bg-gray-900 rounded-xl p-4 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 text-red-400">
                    <Bug size={16} />
                    <span className="text-xs font-mono font-bold uppercase">
                      Error Details
                    </span>
                  </div>
                  <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {error.toString()}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#06392F] text-white font-semibold rounded-xl hover:bg-[#0a5c3d] transition-colors w-full sm:w-auto"
              >
                <RefreshCw size={18} />
                Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                <RefreshCw size={18} className="rotate-180" />
                Reload Page
              </motion.button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-500 font-medium hover:text-[#06392F] transition-colors w-full sm:w-auto justify-center"
              >
                <Home size={18} />
                Go Home
              </Link>
            </div>

            {/* Support Link */}
            <p className="mt-8 text-xs text-gray-400">
              Still having issues?{' '}
              <a
                href="mailto:info@ashamconstruction.co.ke"
                className="underline hover:text-[#06392F] transition-colors"
              >
                Contact support
              </a>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }
}
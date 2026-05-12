'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/supabase/client'
import { toast } from 'react-hot-toast'
import { Send, CheckCircle, AlertCircle, Mail, ArrowRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NewsletterFormProps {
  compact?: boolean
  variant?: 'dark' | 'light' | 'inline'
}

export default function NewsletterForm({ 
  compact = false, 
  variant = 'dark' 
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [success, setSuccess] = useState(false)
  const [touched, setTouched] = useState(false)
  
  const supabase = createClient()

  const isValidEmail = useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }, [])

  const hasError = touched && email.length > 0 && !isValidEmail(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || loading || !isValidEmail(email)) {
      setTouched(true)
      if (!isValidEmail(email)) {
        toast.error('Please enter a valid email address')
      }
      return
    }
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, subscribed_at: new Date().toISOString() }])

      if (error) {
        if ((error as any).code === '23505') {
          toast.success("You're already on our list!", { icon: '👋' })
          setEmail('')
        } else {
          throw error
        }
      } else {
        setSuccess(true)
        toast.success('Welcome to the Asham Journal!', { 
          icon: '🎉',
          duration: 4000 
        })
        setEmail('')
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── VARIANT STYLES ─────────────────────────────────────────
  const styles = {
    dark: {
      wrapper: 'bg-white/5 backdrop-blur-md border-white/20',
      wrapperFocus: 'border-[#C75B39] bg-white/10 shadow-lg shadow-[#C75B39]/10',
      wrapperError: 'border-red-400/50 bg-red-500/5',
      wrapperSuccess: 'border-green-500/50 bg-green-500/5',
      icon: 'text-white/40',
      iconFocus: 'text-[#C75B39]',
      iconSuccess: 'text-green-500',
      input: 'text-white placeholder:text-white/30',
      helper: 'text-white/40',
      button: 'bg-[#C75B39] text-white hover:bg-[#d96c4a] hover:shadow-lg hover:shadow-[#C75B39]/30',
      buttonSuccess: 'bg-green-500 text-white',
      glow: 'bg-[#C75B39]/10',
    },
    light: {
      wrapper: 'bg-white border-gray-200 shadow-sm',
      wrapperFocus: 'border-[#06392F] shadow-lg shadow-[#06392F]/10',
      wrapperError: 'border-red-400 bg-red-50',
      wrapperSuccess: 'border-green-500 bg-green-50',
      icon: 'text-gray-400',
      iconFocus: 'text-[#06392F]',
      iconSuccess: 'text-green-600',
      input: 'text-gray-900 placeholder:text-gray-400',
      helper: 'text-gray-500',
      button: 'bg-[#06392F] text-white hover:bg-[#0a5c3d] hover:shadow-lg hover:shadow-[#06392F]/20',
      buttonSuccess: 'bg-green-600 text-white',
      glow: 'bg-[#06392F]/5',
    },
    inline: {
      wrapper: 'bg-gray-50 border-gray-200',
      wrapperFocus: 'border-[#C75B39] bg-white shadow-md',
      wrapperError: 'border-red-300 bg-red-50',
      wrapperSuccess: 'border-green-400 bg-green-50',
      icon: 'text-gray-400',
      iconFocus: 'text-[#C75B39]',
      iconSuccess: 'text-green-600',
      input: 'text-gray-900 placeholder:text-gray-400',
      helper: 'text-gray-500',
      button: 'bg-[#C75B39] text-white hover:bg-[#d96c4a]',
      buttonSuccess: 'bg-green-600 text-white',
      glow: 'bg-[#C75B39]/5',
    },
  }

  const s = styles[variant]

  // ─── COMPACT MODE ───────────────────────────────────────────
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => { setFocused(false); setTouched(true) }}
              disabled={loading || success}
              className={`
                w-full px-4 py-3 text-sm rounded-xl border-2 
                bg-white/10 text-white placeholder:text-white/40
                focus:outline-none transition-all duration-300
                ${focused ? 'border-[#C75B39] bg-white/20' : 'border-white/20'}
                ${hasError ? 'border-red-400/50' : ''}
                ${success ? 'border-green-500/50' : ''}
                disabled:cursor-not-allowed
              `}
            />
            <AnimatePresence>
              {hasError && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute -bottom-5 left-0 text-[11px] text-red-400 flex items-center gap-1"
                >
                  <AlertCircle size={10} /> Invalid email
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            type="submit"
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-3 rounded-xl font-bold text-sm
              transition-all duration-300 flex items-center justify-center gap-2
              ${success ? 'bg-green-500 text-white' : 'bg-white text-[#06392F] hover:bg-gray-100'}
              ${loading ? 'opacity-80 cursor-wait' : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.span key="success" className="flex items-center gap-2">
                  <CheckCircle size={16} /> Subscribed
                </motion.span>
              ) : loading ? (
                <motion.span key="loading" className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 rounded-full border-[#06392F]/30 border-t-[#06392F] animate-spin" />
                  Joining...
                </motion.span>
              ) : (
                <motion.span key="idle" className="flex items-center gap-2">
                  Subscribe <ArrowRight size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    )
  }

  // ─── FULL MODE ──────────────────────────────────────────────
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-lg mx-auto"
      aria-label="Newsletter subscription form"
    >
      {/* Background Glow */}
      <div className={`absolute -top-20 -right-20 w-48 h-48 ${s.glow} rounded-full blur-3xl pointer-events-none opacity-60`} />
      <div className={`absolute -bottom-20 -left-20 w-48 h-48 ${s.glow} rounded-full blur-3xl pointer-events-none opacity-40`} />

      <motion.div
        className="relative"
        animate={{ scale: focused ? 1.01 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Input Container */}
        <div
          className={`
            relative flex items-center w-full 
            border-2 rounded-2xl
            transition-all duration-300 overflow-hidden
            ${focused ? s.wrapperFocus : s.wrapper}
            ${hasError ? s.wrapperError : ''}
            ${success ? s.wrapperSuccess : ''}
          `}
        >
          {/* Mail Icon */}
          <div className={`
            pl-5 pr-3 transition-colors duration-300 shrink-0
            ${focused ? s.iconFocus : s.icon}
            ${success ? s.iconSuccess : ''}
          `}>
            <Mail className="w-5 h-5" />
          </div>

          {/* Email Input */}
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); setTouched(true) }}
            disabled={loading || success}
            aria-invalid={hasError}
            aria-describedby="newsletter-helper"
            className={`
              flex-1 py-4 pr-4 text-sm font-medium bg-transparent
              focus:outline-none disabled:cursor-not-allowed
              ${s.input}
            `}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success || !email}
            whileHover={!loading && !success ? { scale: 1.05 } : {}}
            whileTap={!loading && !success ? { scale: 0.95 } : {}}
            className={`
              relative mr-2 px-5 py-2.5 rounded-xl
              font-bold text-xs uppercase tracking-[0.15em]
              transition-all duration-300
              flex items-center gap-2 shrink-0
              ${success ? s.buttonSuccess : s.button}
              ${loading ? 'opacity-80 cursor-wait' : ''}
              ${!email ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribed</span>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className={`
                    w-4 h-4 border-2 rounded-full animate-spin
                    ${variant === 'dark' ? 'border-white/30 border-t-white' : 'border-white/40 border-t-white'}
                  `} />
                  <span className="hidden sm:inline">Joining</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  className="flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  <Send className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Validation Error */}
        <AnimatePresence>
          {hasError && (
            <motion.p
              id="newsletter-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-xs text-red-400 flex items-center gap-1.5 px-1"
            >
              <AlertCircle size={12} />
              Please enter a valid email address
            </motion.p>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        <motion.p
          id="newsletter-helper"
          className={`mt-3 text-[11px] font-medium text-center ${s.helper}`}
          animate={{ opacity: focused ? 1 : 0.7 }}
        >
          {success ? (
            <span className="flex items-center justify-center gap-1.5 text-green-500">
              <Sparkles size={12} /> Thank you for joining our community!
            </span>
          ) : (
            'Join 2,000+ professionals receiving monthly insights on architecture and construction.'
          )}
        </motion.p>
      </motion.div>
    </form>
  )
}
// components/blog/ShareButton.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2,
  Link2,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  MessageCircle,
  X,
  Copy,
} from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
  description?: string
  className?: string
  variant?: 'minimal' | 'pill' | 'icon'
}

const platforms = [
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]',
    getUrl: (title: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
    getUrl: (title: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    getUrl: (title: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
    getUrl: (title: string, url: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'hover:bg-gray-900 hover:text-white hover:border-gray-900',
    getUrl: (title: string, url: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Read this: ${url}`)}`,
  },
]

export default function ShareButton({
  title,
  url,
  description,
  className = '',
  variant = 'minimal',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareCount, setShareCount] = useState(0)

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-share-menu]')) setIsOpen(false)
    }
    if (isOpen) window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [isOpen])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setShareCount((c) => c + 1)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [url])

  const handleShare = useCallback(
    (platform: (typeof platforms)[0]) => {
      window.open(platform.getUrl(title, url), '_blank', 'width=600,height=400')
      setShareCount((c) => c + 1)
      setIsOpen(false)
    },
    [title, url]
  )

  // Native share (mobile)
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url })
        setShareCount((c) => c + 1)
      } catch {
        // User cancelled
      }
    } else {
      setIsOpen(true)
    }
  }, [title, description, url])

  // ─── MINIMAL VARIANT ────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <div className="relative" data-share-menu>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors
            ${className}
          `}
        >
          <Share2 size={15} />
          <span className="hidden sm:inline">Share</span>
          {shareCount > 0 && (
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
              {shareCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <ShareMenu
              platforms={platforms}
              onShare={handleShare}
              onCopy={copyToClipboard}
              copied={copied}
              url={url}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ─── PILL VARIANT ───────────────────────────────────────────
  if (variant === 'pill') {
    return (
      <div className="relative" data-share-menu>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            inline-flex items-center gap-2 px-4 py-2.5 
            bg-white border border-gray-200 rounded-full
            text-sm font-medium text-gray-700
            hover:border-[#06392F] hover:text-[#06392F] hover:shadow-md
            transition-all duration-300
            ${className}
          `}
        >
          <Share2 size={16} />
          <span>Share</span>
          {shareCount > 0 && (
            <span className="text-[10px] bg-[#06392F]/10 text-[#06392F] px-2 py-0.5 rounded-full font-bold">
              {shareCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <ShareMenu
              platforms={platforms}
              onShare={handleShare}
              onCopy={copyToClipboard}
              copied={copied}
              url={url}
              align="right"
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ─── ICON VARIANT ───────────────────────────────────────────
  return (
    <div className="relative" data-share-menu>
      <motion.button
        onClick={handleNativeShare}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        className={`
          w-10 h-10 rounded-full bg-white/10 border border-white/20
          flex items-center justify-center text-white/70
          hover:text-white hover:bg-white/20 hover:border-white/40
          transition-all duration-300
          ${className}
        `}
        aria-label="Share article"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={16} />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Share2 size={16} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <ShareMenu
            platforms={platforms}
            onShare={handleShare}
            onCopy={copyToClipboard}
            copied={copied}
            url={url}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── SHARE MENU COMPONENT ─────────────────────────────────────

type SharePlatform = {
  name: string;
  icon: any;
  color: string;
  getUrl: (title: string, url: string) => string;
};

function ShareMenu({
  platforms,
  onShare,
  onCopy,
  copied,
  url,
  align = 'left',
}: {
  platforms: SharePlatform[]
  onShare: (p: SharePlatform) => void
  onCopy: () => void
  copied: boolean
  url: string
  align?: 'left' | 'right'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        absolute z-50 mt-3 w-72
        bg-white rounded-2xl shadow-2xl border border-gray-100
        overflow-hidden
        ${align === 'right' ? 'right-0' : 'left-0'}
      `}
    >
      {/* URL Copy Section */}
      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Page Link
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 truncate font-mono bg-white px-3 py-2 rounded-lg border border-gray-200">
              {url.replace(/^https?:\/\//, '')}
            </p>
          </div>
          <motion.button
            onClick={onCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              shrink-0 p-2.5 rounded-lg border transition-all duration-200
              ${copied
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'bg-white border-gray-200 text-gray-500 hover:border-[#06392F] hover:text-[#06392F]'
              }
            `}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        <AnimatePresence>
          {copied && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[11px] text-green-600 mt-1.5 font-medium"
            >
              Link copied to clipboard
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Platforms */}
      <div className="p-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 pt-1 pb-2">
          Share to
        </p>
        <div className="grid grid-cols-2 gap-1">
          {platforms.map((platform) => (
            <motion.button
              key={platform.name}
              onClick={() => onShare(platform)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm text-gray-600 font-medium
                border border-transparent
                transition-all duration-200
                ${platform.color}
              `}
            >
              <platform.icon size={16} />
              <span>{platform.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decorative accent */}
      <div className="h-0.5 bg-[#C75B39]" />
    </motion.div>
  )
}
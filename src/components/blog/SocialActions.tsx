// components/blog/SocialActions.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Share2,
  Bookmark,
  Check,
  MessageCircle,
  Link2,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  X,
} from 'lucide-react'
import { createClient } from '@/supabase/client'
import { toast } from 'react-hot-toast'

interface SocialActionsProps {
  postId: string
  title: string
  initialLikes?: number
  initialBookmarks?: number
}

const sharePlatforms = [
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-[#1DA1F2] hover:bg-[#1a91da]',
    getUrl: (title: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-[#0A66C2] hover:bg-[#0958a8]',
    getUrl: (title: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-[#1877F2] hover:bg-[#166fe5]',
    getUrl: (title: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-800 hover:bg-gray-900',
    getUrl: (title: string, url: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Read this: ${url}`)}`,
  },
]

export default async function SocialActions({
  postId,
  title,
  initialLikes = 0,
  initialBookmarks = 0,
}: SocialActionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [hasBookmarked, setHasBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)

  const supabase = createClient()

  // Check localStorage for previous interactions
  useEffect(() => {
    const liked = localStorage.getItem(`liked_${postId}`)
    const bookmarked = localStorage.getItem(`bookmarked_${postId}`)
    if (liked) setHasLiked(true)
    if (bookmarked) setHasBookmarked(true)
  }, [postId])

  const handleLike = useCallback(async () => {
    if (hasLiked) return

    // Optimistic update with animation
    setHasLiked(true)
    setLikes((prev) => prev + 1)
    setLikeAnimation(true)
    setTimeout(() => setLikeAnimation(false), 600)

    localStorage.setItem(`liked_${postId}`, 'true')

    try {
      const { error } = await (supabase as any).rpc('increment_likes', {
        post_id: postId,
      })

      if (error) {
        await (supabase as any)
          .from('posts')
          .update({ likes: likes + 1 })
          .eq('id', postId)
      }
    } catch {
      // Silent fail - UI already updated
    }
  }, [hasLiked, postId, likes, supabase])

  const handleBookmark = useCallback(async () => {
    if (hasBookmarked) {
      setHasBookmarked(false)
      setBookmarks((prev) => Math.max(0, prev - 1))
      localStorage.removeItem(`bookmarked_${postId}`)
      toast('Removed from bookmarks', { icon: '🔖' })
      return
    }

    setHasBookmarked(true)
    setBookmarks((prev) => prev + 1)
    localStorage.setItem(`bookmarked_${postId}`, 'true')
    toast.success('Saved to bookmarks', { icon: '🔖' })
  }, [hasBookmarked, postId])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Link copied', { icon: '🔗' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }, [])

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href })
      } catch {
        // User cancelled
      }
    } else {
      setShowShareMenu(true)
    }
  }, [title])

  const handlePlatformShare = useCallback(
    (platform: (typeof sharePlatforms)[0]) => {
      window.open(
        platform.getUrl(title, window.location.href),
        '_blank',
        'width=600,height=400'
      )
      setShowShareMenu(false)
    },
    [title]
  )

  // Close share menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowShareMenu(false)
    }
    if (showShareMenu) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showShareMenu])

  return (
    <div className="relative">
      {/* ─── MAIN ACTIONS ───────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          disabled={hasLiked}
          whileHover={{ scale: hasLiked ? 1 : 1.05 }}
          whileTap={{ scale: hasLiked ? 1 : 0.95 }}
          className={`
            group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full
            border transition-all duration-300
            ${hasLiked
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {likeAnimation ? (
              <motion.div
                key="burst"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 1, 0] }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart size={18} fill="currentColor" className="text-red-400" />
              </motion.div>
            ) : (
              <motion.div
                key="heart"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <Heart
                  size={18}
                  className={`
                    transition-all duration-300
                    ${hasLiked ? 'fill-current' : 'group-hover:scale-110'}
                  `}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <span
            className={`
              text-[11px] font-bold uppercase tracking-[0.15em] tabular-nums
              ${hasLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'}
            `}
          >
            {likes}
          </span>

          {/* Tooltip */}
          {!hasLiked && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Appreciate
            </span>
          )}
        </motion.button>

        {/* Bookmark Button */}
        <motion.button
          onClick={handleBookmark}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            group flex items-center gap-2.5 px-5 py-2.5 rounded-full
            border transition-all duration-300
            ${hasBookmarked
              ? 'bg-amber-50 border-amber-200 text-amber-600'
              : 'bg-white border-gray-200 text-gray-500 hover:border-amber-200 hover:text-amber-500'
            }
          `}
        >
          <Bookmark
            size={18}
            className={`
              transition-all duration-300
              ${hasBookmarked ? 'fill-current' : 'group-hover:scale-110'}
            `}
          />
          <span
            className={`
              text-[11px] font-bold uppercase tracking-[0.15em] tabular-nums
              ${hasBookmarked ? 'text-amber-600' : 'text-gray-400 group-hover:text-amber-500'}
            `}
          >
            {bookmarks}
          </span>
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Share Button */}
        <div className="relative" data-share-menu>
          <motion.button
            onClick={() => setShowShareMenu(!showShareMenu)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              group flex items-center gap-2.5 px-5 py-2.5 rounded-full
              border border-gray-200 bg-white text-gray-500
              hover:border-[#06392F] hover:text-[#06392F]
              transition-all duration-300
              ${showShareMenu ? 'border-[#06392F] text-[#06392F] bg-[#06392F]/5' : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {showShareMenu ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="share"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Share2 size={18} />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
              Share
            </span>
          </motion.button>

          {/* Share Menu */}
          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 bottom-full mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                {/* Copy Link */}
                <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Page Link
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 truncate font-mono bg-white px-3 py-2 rounded-lg border border-gray-200">
                        {typeof window !== 'undefined'
                          ? window.location.href.replace(/^https?:\/\//, '')
                          : ''}
                      </p>
                    </div>
                    <motion.button
                      onClick={handleCopyLink}
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
                            key="link"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Link2 size={16} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
                
                {/* Platforms */}
                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 pt-1 pb-2">
                    Share to
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sharePlatforms.map((platform) => (
                      <motion.button
                        key={platform.name}
                        onClick={() => handlePlatformShare(platform)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                          text-xs font-medium text-white
                          transition-all duration-200
                          ${platform.color}
                        `}
                      >
                        <platform.icon size={14} />
                        <span>{platform.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Native Share (mobile) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <div className="px-3 pb-3">
                    <motion.button
                      onClick={handleNativeShare}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <MessageCircle size={14} />
                      More Options
                    </motion.button>
                  </div>
                )}

                {/* Accent bar */}
                <div className="h-0.5 bg-[#C75B39]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
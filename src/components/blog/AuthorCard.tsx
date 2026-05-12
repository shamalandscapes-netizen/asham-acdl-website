// components/blog/AuthorCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Twitter, Linkedin, Mail, ArrowUpRight, Award, MapPin } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

interface Author {
  _id: string
  name: string
  full_name: string
  role?: string
  bio?: PortableTextBlock[]
  avatar?: string
  image?: string
  email?: string
  social?: {
    twitter?: string
    linkedin?: string
    instagram?: string
  }
}

interface AuthorCardProps {
  author: Author
  variant?: 'sidebar' | 'inline' | 'hero'
}

export default function AuthorCard({ author, variant = 'sidebar' }: AuthorCardProps) {
  const displayName = author.full_name || author.name
  const avatarUrl = author.avatar || author.image
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  // ─── HERO VARIANT (large, for featured posts) ───────────────
  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden bg-[#06392F] rounded-3xl p-8 lg:p-10 text-white"
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C75B39] rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden ring-4 ring-white/10">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-[#C75B39] flex items-center justify-center text-2xl font-black">
                  {initials}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#06392F] flex items-center justify-center">
              <Award size={12} className="text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-xs font-medium tracking-widest uppercase text-[#C75B39] mb-1">
              Written by
            </p>
            <h3 className="text-2xl lg:text-3xl font-black mb-1">{displayName}</h3>
            {author.role && (
              <p className="text-white/60 text-sm flex items-center gap-1.5">
                <MapPin size={13} />
                {author.role} at Asham Design & Construction
              </p>
            )}
          </div>

          {/* Social */}
          <div className="flex items-center gap-2">
            {author.social?.twitter && (
              <SocialButton href={author.social.twitter} icon={<Twitter size={16} />} label="Twitter" />
            )}
            {author.social?.linkedin && (
              <SocialButton href={author.social.linkedin} icon={<Linkedin size={16} />} label="LinkedIn" />
            )}
            {author.email && (
              <SocialButton href={`mailto:${author.email}`} icon={<Mail size={16} />} label="Email" />
            )}
          </div>
        </div>

        {/* Bio */}
        {author.bio && (
          <div className="relative mt-6 pt-6 border-t border-white/10">
            <div className="prose prose-invert prose-sm max-w-none">
              <PortableText value={author.bio} />
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  // ─── INLINE VARIANT (for end of article) ────────────────────
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#06392F]/10 shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={displayName} width={64} height={64} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-[#06392F] flex items-center justify-center text-white font-bold">
              {initials}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900">{displayName}</h4>
            <span className="text-[10px] px-2 py-0.5 bg-[#06392F]/10 text-[#06392F] rounded-full font-semibold uppercase tracking-wider">
              Author
            </span>
          </div>
          {author.role && <p className="text-sm text-gray-500 mb-2">{author.role}</p>}
          {author.bio && (
            <div className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              <PortableText value={author.bio} />
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // ─── SIDEBAR VARIANT (default, sticky) ──────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Top accent bar */}
        <div className="h-1 bg-[#06392F]" />
        
        <div className="p-5">
          {/* Header */}
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
            About the Author
          </p>

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-100"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-[#06392F] flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
              )}
            </motion.div>
            
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 text-sm truncate">{displayName}</h4>
              {author.role && (
                <p className="text-xs text-[#C75B39] font-medium truncate">{author.role}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {author.bio && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                <PortableText 
                  value={author.bio}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
            {author.social?.twitter && (
              <SocialPill href={author.social.twitter} icon={<Twitter size={14} />} color="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]" />
            )}
            {author.social?.linkedin && (
              <SocialPill href={author.social.linkedin} icon={<Linkedin size={14} />} color="hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]" />
            )}
            {author.email && (
              <SocialPill href={`mailto:${author.email}`} icon={<Mail size={14} />} color="hover:bg-[#06392F] hover:text-white hover:border-[#06392F]" />
            )}
            
            <div className="flex-1" />
            
            <Link
              href={`/blog/author/${author._id}`}
              className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#06392F] transition-colors flex items-center gap-1 group/link"
            >
              All Posts
              <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#C75B39]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#C75B39]/20 transition-colors duration-500" />
    </motion.div>
  )
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────

function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
      aria-label={label}
    >
      {icon}
    </motion.a>
  )
}

function SocialPill({ href, icon, color }: { href: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-200 ${color}`}
    >
      {icon}
    </motion.a>
  )
}
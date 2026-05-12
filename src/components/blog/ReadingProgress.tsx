// components/blog/ReadingProgress.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { BookOpen, Clock } from 'lucide-react'

export default function ReadingProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const [readTime, setReadTime] = useState<string>('')
  const headerRef = useRef<HTMLElement | null>(null)
  
  const { scrollYProgress } = useScroll()
  
  // Smooth spring animation for the progress bar
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Transform for the glow effect intensity
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])

  // Calculate reading time from content
  useEffect(() => {
    const article = document.querySelector('article')
    if (article) {
      const text = article.innerText || ''
      const words = text.split(/\s+/).filter(Boolean).length
      const minutes = Math.ceil(words / 200)
      setReadTime(`${minutes} min read`)
    }
  }, [])

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.8
      setIsVisible(scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm" />
        
        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#06392F]"
          style={{ 
            width: useTransform(smoothProgress, (v) => `${v * 100}%`),
          }}
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute top-0 right-0 h-full w-24 bg-[#C75B39] blur-md"
          style={{ 
            opacity: glowOpacity,
            x: useTransform(smoothProgress, (v) => `${v * 100}vw`),
          }}
        />
        
        {/* Leading edge accent */}
        <motion.div
          className="absolute top-0 h-full w-2 bg-[#C75B39] shadow-[0_0_12px_rgba(199,91,57,0.6)]"
          style={{ 
            left: useTransform(smoothProgress, (v) => `${v * 100}%`),
          }}
        />
      </motion.div>

      {/* Floating Progress Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 z-40 hidden lg:flex items-center gap-3"
        initial={{ opacity: 0, y: 20, x: '-50%' }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 20,
          x: '-50%',
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="relative flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-gray-100/50">
          {/* Circular progress */}
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#06392F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="100.53"
                style={{
                  strokeDashoffset: useTransform(smoothProgress, (v) => 100.53 - v * 100.53),
                }}
              />
            </svg>
            
            {/* Percentage */}
            <motion.span 
              className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#06392F]"
            >
              <motion.span>
                {useTransform(smoothProgress, (v) => `${Math.round(v * 100)}%`)}
              </motion.span>
            </motion.span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Reading info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BookOpen size={13} />
            <span>Reading</span>
            {readTime && (
              <>
                <span className="text-gray-300">•</span>
                <Clock size={13} />
                <span>{readTime}</span>
              </>
            )}
          </div>

          {/* Chapter indicator (optional - shows current H2) */}
          <CurrentSection />
        </div>
      </motion.div>

      {/* Mobile: Minimal top bar with percentage */}
      <motion.div
        className="fixed top-4 right-4 z-50 lg:hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100">
          <motion.span 
            className="text-xs font-bold text-[#06392F]"
          >
            {useTransform(smoothProgress, (v) => `${Math.round(v * 100)}%`)}
          </motion.span>
        </div>
      </motion.div>
    </>
  )
}

// Sub-component: Shows current section name
function CurrentSection() {
  const [currentSection, setCurrentSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('article h2[id], article h3[id]')
      let active = ''
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top < 200) {
          active = heading.textContent || ''
        }
      })
      
      setCurrentSection(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!currentSection) return null

  return (
    <>
      <div className="w-px h-6 bg-gray-200" />
      <span className="text-xs text-gray-600 font-medium max-w-[150px] truncate">
        {currentSection}
      </span>
    </>
  )
}
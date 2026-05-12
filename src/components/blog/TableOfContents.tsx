// components/blog/TableOfContents.tsx
'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, ChevronRight, Minimize2, Maximize2 } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content?: any[] // PortableText blocks (optional - falls back to DOM scraping)
  className?: string
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Extract headings from PortableText content or DOM
  useEffect(() => {
    const extractHeadings = () => {
      // If content prop provided, parse from PortableText
      if (content && content.length > 0) {
        const parsed: Heading[] = content
          .filter((block: any) => block._type === 'block' && ['h2', 'h3'].includes(block.style))
          .map((block: any) => {
            const text = block.children?.map((child: any) => child.text).join('') || ''
            const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
            return {
              id,
              text,
              level: block.style === 'h2' ? 2 : 3,
            }
          })
        setHeadings(parsed)
        return
      }

      // Fallback: scrape from DOM after content renders
      const observer = new MutationObserver(() => {
        const elements = Array.from(document.querySelectorAll('article h2[id], article h3[id]'))
        const parsed: Heading[] = elements.map((el) => ({
          id: el.id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3,
        }))
        setHeadings(parsed)
      })

      observer.observe(document.body, { childList: true, subtree: true })

      // Initial scrape
      const elements = Array.from(document.querySelectorAll('article h2[id], article h3[id]'))
      const parsed: Heading[] = elements.map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      }))
      setHeadings(parsed)

      return () => observer.disconnect()
    }

    // Small delay to ensure content is rendered
    const timer = setTimeout(extractHeadings, 100)
    return () => clearTimeout(timer)
  }, [content])

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  // Smooth scroll to heading
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 120 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      // Update URL hash without jump
      window.history.pushState(null, '', `#${id}`)
      setActiveId(id)
      setIsMobileOpen(false)
    }
  }, [])

  // Check if mobile
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 1024
  }, [])

  if (headings.length === 0) return null

  return (
    <>
      {/* Desktop Sidebar TOC */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-28">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <List size={16} className="text-[#06392F]" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  In This Article
                </span>
              </div>
              {isCollapsed ? (
                <Maximize2 size={14} className="text-gray-400" />
              ) : (
                <Minimize2 size={14} className="text-gray-400" />
              )}
            </button>

            {/* Content */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <nav aria-label="Table of contents" className="px-5 pb-5">
                    <ul className="space-y-1">
                      {headings.map((heading, index) => (
                        <motion.li
                          key={heading.id}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            onClick={() => scrollToHeading(heading.id)}
                            className={`
                              group flex items-start gap-2 w-full text-left py-2 px-2 rounded-lg transition-all duration-200
                              ${heading.level === 3 ? 'pl-6' : ''}
                              ${activeId === heading.id
                                ? 'bg-[#06392F]/5 text-[#06392F] font-semibold'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                              }
                            `}
                          >
                            <ChevronRight
                              size={14}
                              className={`
                                mt-0.5 shrink-0 transition-transform duration-200
                                ${activeId === heading.id ? 'rotate-90 text-[#C75B39]' : 'text-gray-300 group-hover:text-gray-400'}
                              `}
                            />
                            <span className="text-sm leading-snug line-clamp-2">
                              {heading.text}
                            </span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  {/* Progress indicator */}
                  <div className="px-5 pb-5">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#C75B39] rounded-full"
                        initial={{ width: '0%' }}
                        animate={{
                          width: `${((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">
                      {Math.round(
                        ((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100
                      )}
                      % read
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Mobile Floating TOC */}
      <div className="lg:hidden">
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 bottom-24 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[60vh] overflow-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Contents
                  </span>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <Minimize2 size={16} />
                  </button>
                </div>
                <ul className="space-y-1">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`
                          w-full text-left py-2 px-3 rounded-lg text-sm transition-colors
                          ${heading.level === 3 ? 'pl-6 text-gray-400' : 'text-gray-600'}
                          ${activeId === heading.id ? 'bg-[#06392F]/5 text-[#06392F] font-medium' : 'hover:bg-gray-50'}
                        `}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Toggle Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`
            fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg
            transition-colors duration-300
            ${isMobileOpen ? 'bg-gray-900 text-white' : 'bg-[#06392F] text-white'}
          `}
        >
          <List size={20} />
        </motion.button>
      </div>
    </>
  )
}
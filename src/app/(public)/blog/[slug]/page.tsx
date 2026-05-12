import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { Calendar, Clock, ArrowLeft, Eye, ChevronRight } from 'lucide-react'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

// Components
import BlogSkeleton from '@/components/blog/BlogSkeleton'
import ErrorBoundary from '@/components/ErrorBoundary'
import TableOfContents from '@/components/blog/TableOfContents'
import ReadingProgress from '@/components/blog/ReadingProgress'
import AuthorCard from '@/components/blog/AuthorCard'
import ShareButton from '@/components/blog/ShareButton'
import SocialActions from '@/components/blog/SocialActions'
import BlogPreview from '@/components/blog/BlogPreview'
import ViewTracker from '@/components/blog/ViewTracker'
import NewsletterForm from '@/components/NewsletterForm'

// ─── TYPES ────────────────────────────────────────────────────

interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

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

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  content: PortableTextBlock[]
  mainImage?: SanityImage
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt?: string
  featured?: boolean
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  views?: number
  author?: Author
}

interface RelatedPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  image_url?: string
  category?: string
  createdAt: string
}

interface PortableTextMark {
  _type: string
  href?: string
}

// ─── GROQ QUERIES ─────────────────────────────────────────────

const POST_QUERY = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "content": body,
    mainImage,
    category,
    tags,
    "createdAt": publishedAt,
    updatedAt,
    featured,
    metaTitle,
    metaDescription,
    canonicalUrl,
    views,
    "author": author->{
      _id,
      "full_name": coalesce(full_name, name),
      name,
      role,
      bio,
      "avatar": avatar.asset->url,
      "image": image.asset->url,
      email,
      social
    }
  }
`

const RELATED_POSTS_QUERY = `
  *[_type == "post" && slug.current != $slug && category == $category] | order(publishedAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image_url": mainImage.asset->url,
    category,
    "createdAt": publishedAt
  }
`

// ─── HELPERS ──────────────────────────────────────────────────

function toPlainText(blocks: PortableTextBlock[] = []): string {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      if (block._type !== 'block' || !('children' in block)) {
        return ''
      }
      const children = (block as any).children as Array<{ text?: string }>
      return children.map((child) => child.text || '').join('')
    })
    .join('\n\n')
}

const getReadTime = (content: PortableTextBlock[]): number => {
  if (!content) return 1
  const text = toPlainText(content)
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── METADATA ─────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post: Post = await client.fetch(POST_QUERY, { slug })

  if (!post) {
    return {
      title: 'Post Not Found | The Asham Journal',
      description: 'The requested article could not be found.',
    }
  }

  const title = post.metaTitle || `${post.title} | The Asham Journal`
  const description =
    post.metaDescription ||
    post.excerpt ||
    `Read ${post.title} on The Asham Journal — expert construction and architecture insights from Nairobi.`
  const canonical =
    post.canonicalUrl || `https://ashamconstruction.co.ke/blog/${post.slug}`
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : 'https://ashamconstruction.co.ke/og-default.jpg'

  return {
    title,
    description,
    keywords: [
      ...(post.tags || []),
      'construction blog Kenya',
      'Nairobi architecture',
      'Asham Construction',
      post.category,
    ].filter((k): k is string => Boolean(k)),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Asham Design & Construction',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      locale: 'en_KE',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.full_name ? [post.author.full_name] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// ─── STRUCTURED DATA ──────────────────────────────────────────

function generateArticleSchema(post: Post): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage
      ? urlFor(post.mainImage).width(1200).url()
      : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.full_name,
          jobTitle: post.author.role,
          image: post.author.avatar || undefined,
        }
      : {
          '@type': 'Organization',
          name: 'Asham Design & Construction',
        },
    publisher: {
      '@type': 'Organization',
      name: 'Asham Design & Construction Ltd',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ashamconstruction.co.ke/logo.png',
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ashamconstruction.co.ke/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    wordCount: toPlainText(post.content || []).split(/\s+/).filter(Boolean)
      .length,
  }
}

function generateBreadcrumbSchema(post: Post): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ashamconstruction.co.ke',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: 'https://ashamconstruction.co.ke/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://ashamconstruction.co.ke/blog/${post.slug}`,
      },
    ],
  }
}

// ─── PORTABLE TEXT COMPONENTS ─────────────────────────────────

const portableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => (
      <figure className="my-12">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={urlFor(value).width(1200).quality(90).url()}
            alt={value.alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-3 text-center text-sm text-gray-400">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    code: ({ value }: { value: { code: string } }) => (
      <pre className="my-8 p-6 bg-gray-900 rounded-xl overflow-x-auto">
        <code className="text-sm text-gray-100 font-mono">{value.code}</code>
      </pre>
    ),
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = children?.toString() || ''
      const id = text.toLowerCase().replace(/\s+/g, '-')
      return (
        <h2
          id={id}
          className="text-2xl lg:text-3xl font-bold text-gray-900 mt-16 mb-6 scroll-mt-24"
        >
          {children}
        </h2>
      )
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const text = children?.toString() || ''
      const id = text.toLowerCase().replace(/\s+/g, '-')
      return (
        <h3
          id={id}
          className="text-xl lg:text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-24"
        >
          {children}
        </h3>
      )
    },
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-8 pl-6 border-l-4 border-[#C75B39] bg-[#C75B39]/5 py-4 pr-4 rounded-r-xl">
        <p className="text-lg text-gray-700 italic leading-relaxed">
          {children}
        </p>
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-600 leading-[1.8] mb-6 text-lg">{children}</p>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode
      value?: PortableTextMark
    }) => (
      <Link
        href={value?.href || '#'}
        className="text-[#06392F] underline underline-offset-4 decoration-[#C75B39]/30 hover:decoration-[#C75B39] transition-all font-medium"
      >
        {children}
      </Link>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-6 space-y-3 list-none pl-0">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="my-6 space-y-3 list-decimal pl-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-3 text-gray-600">
        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C75B39] shrink-0" />
        <span>{children}</span>
      </li>
    ),
  },
}

// ─── MAIN CONTENT COMPONENT ───────────────────────────────────

async function BlogPostContent({ slug }: { slug: string }) {
  const post: Post = await client.fetch(POST_QUERY, { slug })

  if (!post) notFound()

  const relatedPosts: RelatedPost[] = await client.fetch(RELATED_POSTS_QUERY, {
    slug,
    category: post.category || '',
  })

  const readTime = getReadTime(post.content)
  const articleSchema = generateArticleSchema(post)
  const breadcrumbSchema = generateBreadcrumbSchema(post)

  return (
    <>
      {/* Structured Data */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* View Tracker */}
      <ViewTracker postId={post._id} />

      {/* Reading Progress Bar */}
      <ReadingProgress />

      <article className="min-h-screen bg-white">
        {/* ─── HERO SECTION ─────────────────────────────────── */}
        <header className="relative bg-[#06392F] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pt-32 lg:pb-40">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li>
                  <Link
                    href="/"
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <ChevronRight size={14} />
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Journal
                  </Link>
                </li>
                <ChevronRight size={14} />
                <li className="text-white/80 truncate max-w-[200px]">
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* Category */}
            {post.category && (
              <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider uppercase bg-white/10 text-white/90 rounded-full border border-white/10">
                {post.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg lg:text-xl text-white/70 max-w-2xl leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={15} />
                <time dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={15} />
                <span>{post.views || 0} views</span>
              </div>
              <ShareButton
                title={post.title}
                url={`https://ashamconstruction.co.ke/blog/${post.slug}`}
              />
            </div>
          </div>

          {/* Hero Image */}
          {post.mainImage && (
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mb-20 lg:-mb-32">
              <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(post.mainImage).width(1600).quality(90).url()}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>
            </div>
          )}
        </header>

        {/* ─── CONTENT AREA ─────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-32 lg:pt-48 pb-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Sidebar (TOC + Author) */}
            <aside className="lg:col-span-3 space-y-8">
              <div className="sticky top-24 space-y-8">
                {/* Back Link */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#06392F] transition-colors group"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to Journal
                </Link>

                {/* Table of Contents */}
                <TableOfContents content={post.content} />

                {/* Author Card */}
                {post.author && <AuthorCard author={post.author} />}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full border border-gray-100 hover:border-[#06392F] hover:text-[#06392F] transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-6">
              <div className="prose-custom">
                <PortableText
                  value={post.content}
                  components={portableTextComponents}
                />
              </div>

              {/* Social Actions */}
              <div className="mt-16 pt-8 border-t border-gray-100">
                <SocialActions postId={post._id} title={post.title} />
              </div>
            </div>

            {/* Right Sidebar (Newsletter) */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-[#06392F] rounded-2xl p-6 text-white">
                  <h4 className="font-bold text-lg mb-2">
                    Enjoying this article?
                  </h4>
                  <p className="text-sm text-white/60 mb-4">
                    Get weekly insights on architecture and construction in
                    Kenya.
                  </p>
                  <NewsletterForm compact />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ─── RELATED POSTS ────────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <BlogPreview posts={relatedPosts} title="Continue Reading" />
            </div>
          </section>
        )}

        {/* ─── BOTTOM CTA ───────────────────────────────────── */}
        <section className="bg-[#06392F] py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
              Ready to Build?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Let's discuss your next project. From concept to completion, we
              deliver excellence.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#06392F] font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Start Your Project{' '}
              <ArrowLeft size={18} className="rotate-180" />
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}

// ─── PAGE EXPORT ──────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to load article
            </h2>
            <p className="text-gray-500 mb-4">
              Please refresh or try again later.
            </p>
            <Link
              href="/blog"
              className="text-[#06392F] font-medium hover:underline"
            >
              Return to Journal
            </Link>
          </div>
        </div>
      }
    >
      <Suspense fallback={<BlogSkeleton />}>
        <BlogPostContent slug={slug} />
      </Suspense>
    </ErrorBoundary>
  )
}
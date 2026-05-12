import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import BlogPreview from '@/components/blog/BlogPreview'

const AUTHOR_QUERY = `
  *[_type == "author" && _id == $id][0]{
    _id,
    name,
    full_name,
    role,
    bio,
    "avatar": avatar.asset->url,
    "image": image.asset->url,
    email,
    social
  }
`

const POSTS_QUERY = `
  *[_type == "post" && author._ref == $id] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image_url": mainImage.asset->url,
    category,
    "createdAt": publishedAt
  }
`

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const author = await client.fetch(AUTHOR_QUERY, { id })
  if (!author) notFound()

  const posts = await client.fetch(POSTS_QUERY, { id })

  const displayName = author.full_name || author.name
  const avatarUrl = author.avatar || author.image
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#06392F] text-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Journal
          </Link>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden ring-4 ring-white/10 shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-[#C75B39] flex items-center justify-center text-2xl font-black">
                  {initials}
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-3xl lg:text-5xl font-black">{displayName}</h1>
              {author.role && <p className="text-white/60 mt-1">{author.role}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-gray-900">
            Articles <span className="text-gray-400 font-normal">({posts.length})</span>
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="group">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={post.image_url || '/placeholder-blog.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#06392F] transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={12} />
                  {new Date(post.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">No articles published yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
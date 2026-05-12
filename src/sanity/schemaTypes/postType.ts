import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'category',
      title: 'Primary Category',
      type: 'string',
      description: 'Used for blog filtering and related posts',
      options: {
        list: [
          { title: 'Design Philosophy', value: 'Design Philosophy' },
          { title: 'Sustainability', value: 'Sustainability' },
          { title: 'Projects', value: 'Projects' },
          { title: 'Industry Insights', value: 'Industry Insights' },
          { title: 'Studio Life', value: 'Studio Life' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary for blog cards and SEO (150-160 chars ideal)',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as featured post (appears in hero section)',
    }),
    defineField({
      name: 'views',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'likes',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Number of user likes (auto-incremented)',
    }),
    defineField({
      name: 'bookmarks',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Number of user bookmarks (auto-incremented)',
    }),
    // SEO Fields
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Override the default page title for SEO (50-60 chars)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Override the default meta description (150-160 chars)',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Override the default canonical URL if this content is syndicated',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      featured: 'featured',
      publishedAt: 'publishedAt',
      likes: 'likes',
      views: 'views',
    },
    prepare(selection) {
      const { author, featured, publishedAt, likes, views } = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-KE') : ''
      const engagement = [
        likes ? `❤️ ${likes}` : '',
        views ? `👁️ ${views}` : '',
      ].filter(Boolean)
      
      const badges = [
        featured ? '⭐ FEATURED' : '',
        date,
        ...engagement,
      ].filter(Boolean)
      
      return {
        ...selection,
        subtitle: `${author ? `by ${author}` : ''}${badges.length > 0 ? ` | ${badges.join(' | ')}` : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Most Liked',
      name: 'likesDesc',
      by: [{ field: 'likes', direction: 'desc' }],
    },
    {
      title: 'Most Viewed',
      name: 'viewsDesc',
      by: [{ field: 'views', direction: 'desc' }],
    },
  ],
})
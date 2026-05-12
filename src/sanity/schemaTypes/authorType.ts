import { UserIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'full_name',
      title: 'Full Name',
      type: 'string',
      description: 'Display name (e.g., "John Doe")',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Square avatar for author cards (400x400px ideal)',
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'Job title (e.g., "Lead Architect", "Project Manager")',
    }),
    defineField({
      name: 'bio',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        }),
      ],
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      media: 'image',
    },
    prepare(selection) {
      const { role } = selection
      return {
        ...selection,
        subtitle: role || 'Author',
      }
    },
  },
})
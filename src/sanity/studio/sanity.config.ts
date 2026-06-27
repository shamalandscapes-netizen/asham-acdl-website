import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schema } from '../schemaTypes'
import { projectId, dataset } from '../env'

export const config = defineConfig({
  name: 'default',
  title: 'Asham DCL',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [deskTool()],

  schema,
})
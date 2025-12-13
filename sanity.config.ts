'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { structure } from '@/sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lgiw0vhg'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    plugins: [
        structureTool({ structure }),
        visionTool()
    ],
    schema: {
        types: schemaTypes,
    },
})

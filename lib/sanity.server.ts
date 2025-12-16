import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lgiw0vhg'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

// This client must only be used in server components or API routes
// It requires a SANITY_API_TOKEN with write permissions in .env.local
export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // We want fresh data for writes
    token: process.env.SANITY_API_TOKEN,
})

import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'lgiw0vhg',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_WRITE_TOKEN, // Trying to see if I can write without a token... usually not. 
    // Wait, I don't have a write token. I only have the project ID. 
    // I cannot write data without a token. 
    // I will skip seeding and just handle empty states in the UI.
    useCdn: false,
})

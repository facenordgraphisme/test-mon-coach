'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

import { useEffect } from 'react'

export default function StudioPage() {
    useEffect(() => {
        // Suppress specific React warning about disableTransition
        const originalError = console.error;
        console.error = (...args) => {
            const merged = args.join(' ');
            if (merged.includes('disableTransition')) {
                return;
            }
            originalError.call(console, ...args);
        };
        return () => {
            console.error = originalError;
        };
    }, []);

    return <NextStudio config={config} />
}

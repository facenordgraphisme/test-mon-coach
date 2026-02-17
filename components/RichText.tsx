"use client"

import { PortableText } from "@portabletext/react"
import { ptComponents } from "./PortableTextComponents"

export function RichText({ value }: { value: any }) {
    return <PortableText value={value} components={ptComponents} />
}

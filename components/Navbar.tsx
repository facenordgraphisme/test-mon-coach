"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    if (pathname.startsWith("/studio")) return null

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { href: "/", label: "Accueil" },
        { href: "/activities", label: "Aventures" },
        { href: "/calendar", label: "Calendrier" },
        { href: "/guide", label: "Le Guide" },
        { href: "/contact", label: "Contact" },
    ]

    const isHeroPage = pathname === "/" || pathname === "/activities" || pathname === "/guide" || pathname.startsWith("/activities/")
    const showScrolledState = isScrolled || !isHeroPage

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                showScrolledState ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-stone-200" : "bg-transparent py-5 text-white"
            )}
        >
            <div className="container px-4 md:px-6 flex items-center justify-between">

                {/* Logo */}
                {/* Logo */}
                <Link href="/" className="relative h-20 w-64">
                    <Image
                        src="/assets/logo.png"
                        alt="Mon Coach Plein Air"
                        fill
                        className={cn(
                            "object-contain object-left transition-all duration-300",
                            !showScrolledState && "brightness-0 invert"
                        )}
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium hover:opacity-70 transition-opacity",
                                pathname === link.href ? "underline underline-offset-4 decoration-2 decoration-[var(--brand-water)]" : "",
                                showScrolledState ? "text-stone-700" : "text-gray-100"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Button asChild size="sm" className={cn("rounded-full px-6", showScrolledState ? "bg-stone-900 text-white" : "bg-white text-stone-900 hover:bg-gray-100")}>
                        <Link href="/calendar">Réserver</Link>
                    </Button>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className={cn("w-6 h-6", showScrolledState ? "text-stone-900" : "text-white")} />
                    ) : (
                        <Menu className={cn("w-6 h-6", showScrolledState ? "text-stone-900" : "text-white")} />
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-stone-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium text-stone-800 py-2 border-b border-stone-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
        {
            href: "#",
            label: "Aventures",
            children: [
                { href: "/aventures/mono-activite", label: "Mono-activité" },
                { href: "/aventures/duo-activites", label: "Duo d'activités" },
                { href: "/aventures/sur-mesure", label: "Sur-mesure" },
            ]
        },
        { href: "/calendrier", label: "Calendrier" },
        { href: "/guide", label: "Le Guide" },
        { href: "/contact", label: "Contact" },
        {
            href: "#",
            label: "Plus",
            children: [
                { href: "/niveaux", label: "Niveaux" },
                { href: "/avis", label: "Avis Clients" },
                { href: "/acces", label: "Accès & Hébergement" },
            ]
        },
    ]

    const isHeroPage = pathname === "/" || pathname === "/aventures" || pathname === "/guide" || pathname.startsWith("/aventures/") || pathname === "/niveaux" || pathname === "/calendrier" || pathname === "/contact" || pathname === "/avis" || pathname === "/acces"
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
                <Link href="/" className="relative h-14 w-40 md:h-16 md:w-52">
                    <Image
                        src="/assets/logo-v2.png"
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
                    {navLinks.map((link) => (
                        <div key={link.label} className="relative group">
                            <Link
                                href={link.href}
                                onClick={(e) => link.href === '#' && e.preventDefault()}
                                className={cn(
                                    "text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1",
                                    pathname === link.href ? "underline underline-offset-4 decoration-2 decoration-[var(--brand-water)]" : "",
                                    showScrolledState ? "text-stone-700" : "text-gray-100",
                                    link.href === '#' && "cursor-default"
                                )}
                            >
                                {link.label}
                                {link.children && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                                )}
                            </Link>

                            {/* Dropdown */}
                            {link.children && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block">
                                    <div className="bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden min-w-[200px] py-1">
                                        {link.children.map((subLink) => (
                                            <Link
                                                key={subLink.label}
                                                href={subLink.href}
                                                className="block px-6 py-3 text-sm text-stone-700 hover:bg-stone-50 hover:text-[var(--brand-water)] transition-colors whitespace-nowrap"
                                            >
                                                {subLink.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <Button asChild size="sm" className={cn("rounded-full px-6", showScrolledState ? "bg-stone-900 text-white" : "bg-white text-stone-900 hover:bg-gray-100")}>
                        <Link href="/calendrier">Réserver</Link>
                    </Button>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 relative z-50"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <AnimatePresence mode="wait">
                        {mobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className={cn("w-6 h-6", (showScrolledState || mobileMenuOpen) ? "text-stone-900" : "text-white")} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className={cn("w-6 h-6", showScrolledState ? "text-stone-900" : "text-white")} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute top-full left-0 right-0 bg-white border-b border-stone-100 shadow-xl md:hidden overflow-hidden"
                        >
                            <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                                {navLinks.map((link) => (
                                    <div key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="block text-lg font-bold text-stone-800 py-2 border-b border-stone-50"
                                            onClick={() => {
                                                if (link.href !== '#') setMobileMenuOpen(false)
                                            }}
                                        >
                                            {link.label}
                                        </Link>
                                        {link.children && (
                                            <div className="pl-4 mt-2 space-y-2 border-l-2 border-stone-100 ml-2">
                                                {link.children.map((subLink) => (
                                                    <Link
                                                        key={subLink.label}
                                                        href={subLink.href}
                                                        className="block text-base text-stone-600 py-1"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subLink.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Button asChild size="lg" className="w-full mt-4 bg-stone-900 text-white rounded-xl">
                                    <Link href="/calendrier" onClick={() => setMobileMenuOpen(false)}>Réserver une aventure</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}

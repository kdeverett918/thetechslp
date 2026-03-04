import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '../utils/cn';
import Logo from './Logo';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#playground', label: 'Demos' },
    { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Handle scroll state for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // GSAP animation for mobile menu
    useEffect(() => {
        if (!menuRef.current) return;

        if (isOpen) {
            gsap.to(menuRef.current, {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 0.6,
                ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
            });
            gsap.fromTo(
                menuRef.current.querySelectorAll('a'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.2, ease: 'power2.out' }
            );
        } else {
            gsap.to(menuRef.current, {
                clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
                duration: 0.4,
                ease: 'power2.inOut',
            });
        }
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled ? 'bg-[var(--color-bg)]/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
            )}
        >
            <div className="container-wide flex items-center justify-between">
                {/* Logo */}
                <a
                    href="#"
                    className="z-50 relative mix-blend-difference text-[var(--color-text)]"
                >
                    <Logo />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-[var(--color-text)] font-body font-medium hover:text-[var(--color-primary)] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a href="#contact" className="btn-primary">
                        Start a Project
                    </a>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden relative z-50 p-2 text-[var(--color-text)] mix-blend-difference"
                    onClick={toggleMenu}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <div
                ref={menuRef}
                className="fixed inset-0 bg-[var(--color-text)] z-40 flex flex-col items-center justify-center"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            >
                <nav className="flex flex-col items-center space-y-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-4xl font-display font-bold text-[var(--color-bg)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-8">
                        <a
                            href="#contact"
                            onClick={() => setIsOpen(false)}
                            className="btn-primary text-xl"
                        >
                            Start a Project
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
}

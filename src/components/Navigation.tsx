import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router';
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
    const toggleRef = useRef<HTMLButtonElement>(null);
    const location = useLocation();
    const isHome = location.pathname === '/';

    const resolveHref = (hash: string) => isHome ? hash : `/${hash}`;

    const closeMenu = useCallback(() => setIsOpen(false), []);

    // Handle scroll state for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Escape key closes menu
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeMenu();
                toggleRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeMenu]);

    // GSAP animation for mobile menu
    useEffect(() => {
        if (!menuRef.current) return;

        if (isOpen) {
            gsap.to(menuRef.current, {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 0.6,
                ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
                onComplete: () => {
                    // Focus first menu link after animation
                    const firstLink = menuRef.current?.querySelector('a');
                    firstLink?.focus();
                },
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

    const toggleMenu = () => {
        if (isOpen) {
            setIsOpen(false);
            toggleRef.current?.focus();
        } else {
            setIsOpen(true);
        }
    };

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
                    href="/"
                    className={cn(
                        'z-50 relative transition-colors duration-300',
                        isScrolled ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text)]'
                    )}
                >
                    <Logo isScrolled={isScrolled} />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={resolveHref(link.href)}
                            className="text-[var(--color-text)] font-body font-medium hover:text-[var(--color-primary)] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href={resolveHref('#contact')}
                        className={cn(
                            'btn-primary transition-all duration-300',
                            isScrolled && 'bg-[var(--color-secondary)] border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80'
                        )}
                    >
                        Start a Project
                    </a>
                </nav>

                {/* Mobile Toggle */}
                <button
                    ref={toggleRef}
                    className={cn(
                        'md:hidden relative z-50 p-2 transition-colors duration-300',
                        isScrolled ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text)]'
                    )}
                    onClick={toggleMenu}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <div
                ref={menuRef}
                id="mobile-menu"
                role="dialog"
                aria-label="Navigation menu"
                aria-hidden={!isOpen}
                className="fixed inset-0 bg-[var(--color-text)] z-40 flex flex-col items-center justify-center"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            >
                <nav className="flex flex-col items-center space-y-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={resolveHref(link.href)}
                            onClick={closeMenu}
                            className="text-4xl font-display font-bold text-[var(--color-bg)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-8">
                        <a
                            href={resolveHref('#contact')}
                            onClick={closeMenu}
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

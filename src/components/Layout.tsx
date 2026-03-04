import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-[var(--color-text-on-primary)] focus:px-6 focus:py-3 focus:font-display focus:font-bold"
            >
                Skip to main content
            </a>
            <Navigation />
            <main id="main" className="w-full relative z-10 flex flex-col bg-[var(--color-bg)]">
                {children}
            </main>
            <Footer />
        </>
    );
}

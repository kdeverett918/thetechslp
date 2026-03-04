import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navigation />
            <main className="w-full relative z-10 flex flex-col bg-[var(--color-bg)]">
                {children}
            </main>
            <Footer />
        </>
    );
}

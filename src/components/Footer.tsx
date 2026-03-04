import Logo from './Logo';

export default function Footer() {
    return (
        <footer className="bg-[var(--color-text)] text-[var(--color-bg)] py-10 relative z-0">
            <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <Logo />
                </div>

                <div className="flex gap-8 font-mono text-sm uppercase tracking-widest text-[var(--color-secondary)]">
                    <a href="mailto:kristine@thetechslp.com" className="hover:text-[var(--color-primary)] transition-colors">kristine@thetechslp.com</a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)] transition-colors">LinkedIn</a>
                </div>
            </div>

            <div className="container-wide mt-8 pt-6 border-t border-[var(--color-bg)]/20 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-[var(--color-bg)]/50">
                <p>&copy; {new Date().getFullYear()} The Tech SLP. All rights reserved.</p>
                <p className="mt-2 md:mt-0">DESIGNED AND BUILT IN SEATTLE</p>
            </div>
        </footer>
    );
}

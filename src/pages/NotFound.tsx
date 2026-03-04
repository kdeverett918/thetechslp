import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    useEffect(() => {
        document.title = 'Page Not Found — The Tech SLP';
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Top bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
                <div className="container-wide flex items-center h-16">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-display font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        The Tech SLP
                    </Link>
                </div>
            </div>

            <div className="container-wide pt-28 pb-24 flex flex-col items-center justify-center min-h-screen">
                <div className="card-solid p-12 text-center w-full max-w-[32rem]">
                    <p className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)] mb-4">
                        404
                    </p>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text)] tracking-tight mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-[var(--color-text-muted)] font-body text-lg leading-relaxed mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link to="/" className="btn-primary">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

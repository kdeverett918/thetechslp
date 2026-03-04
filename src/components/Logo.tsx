export default function Logo({ className = '' }: { className?: string }) {
    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            {/* Logo mark — speech bubble + circuit node */}
            <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                {/* Speech bubble outline */}
                <path
                    d="M4 6C4 4.89543 4.89543 4 6 4H30C31.1046 4 32 4.89543 32 6V22C32 23.1046 31.1046 24 30 24H14L8 30V24H6C4.89543 24 4 23.1046 4 22V6Z"
                    fill="var(--color-primary)"
                    stroke="var(--color-text)"
                    strokeWidth="2"
                />
                {/* Tech circuit lines inside bubble */}
                <line x1="10" y1="10" x2="18" y2="10" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="10" x2="18" y2="18" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="14" x2="26" y2="14" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round" />
                {/* Circuit nodes */}
                <circle cx="10" cy="10" r="2.5" fill="var(--color-secondary)" stroke="var(--color-text)" strokeWidth="1" />
                <circle cx="26" cy="14" r="2.5" fill="var(--color-secondary)" stroke="var(--color-text)" strokeWidth="1" />
                <circle cx="18" cy="18" r="2.5" fill="var(--color-bg)" stroke="var(--color-text)" strokeWidth="1" />
            </svg>
            {/* Wordmark */}
            <span className="text-2xl font-display font-bold tracking-tight leading-none">
                the tech <span className="text-[var(--color-primary)]">slp</span>
            </span>
        </span>
    );
}

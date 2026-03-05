import { useEffect, useRef } from 'react';
import { createReveal } from '../utils/animations';

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) createReveal(containerRef.current, 'up', 0.1);
        if (textRef.current) createReveal(textRef.current, 'left', 0.3);
    }, []);

    return (
        <section id="about" className="section-padding bg-[var(--color-bg)]">
            <div className="container-wide">

                <div ref={containerRef} className="card-outer">
                    <div className="card-inner-dark p-8 md:p-16 lg:p-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-hidden relative">

                        {/* Massive decorative ampersand */}
                        <div className="absolute -right-20 -top-20 text-[30rem] font-display font-black text-[var(--color-bg)] opacity-5 pointer-events-none select-none">
                            &
                        </div>

                        {/* Content */}
                        <div ref={textRef} className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-2 mb-2">
                                <div className="w-8 h-[2px] bg-[var(--color-primary)]" />
                                <span className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)]">Why This Work Matters</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-bg)] tracking-tight">
                                THE PHILOSOPHY
                            </h2>

                            <div className="space-y-6 text-lg text-[var(--color-bg)]/80 font-body leading-relaxed">
                                <p>
                                    Clinicians are exhausted by generic templates and bloated enterprise software. The tools we use directly shape the quality of care we deliver — and most of them weren't built by people who understand the work.
                                </p>
                                <p>
                                    As a practicing SLP, I know the friction points firsthand: documentation bottlenecks, cognitive overload during sessions, clunky systems that slow everything down. I build software that eliminates those barriers.
                                </p>
                                <p>
                                    Every application I create is purpose-built — elegant, fast, and designed by someone who actually does the clinical work. That's the difference.
                                </p>
                            </div>

                            <div className="pt-4">
                                <a href="#contact" className="btn-primary bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-bg)] border-[var(--color-bg)] shadow-none">
                                    Let's Collaborate
                                </a>
                            </div>
                        </div>

                        {/* Portrait */}
                        <div className="relative z-10 aspect-square rounded-[var(--radius-xl)] bg-[var(--color-bg)] overflow-hidden border-[length:var(--border-width-base)] border-[var(--color-bg)] p-4 flex flex-col justify-between" style={{ boxShadow: 'var(--shadow-solid-lg)' }}>
                            <div className="text-[var(--color-text)] font-mono text-sm font-bold tracking-widest uppercase mb-4">
                                System Logic // 01
                            </div>
                            <div className="w-full h-full rounded-[var(--radius-lg)] bg-[var(--color-secondary)] grayscale contrast-125 bg-[url('/kristine_portrait.webp')] bg-cover bg-center mix-blend-multiply" />
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

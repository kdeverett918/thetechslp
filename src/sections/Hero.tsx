import { useEffect, useRef } from 'react';
import { createTextReveal, createReveal } from '../utils/animations';

export default function Hero() {
    const title1Ref = useRef<HTMLHeadingElement>(null);
    const title2Ref = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (title1Ref.current) createTextReveal(title1Ref.current, 0.1);
        if (title2Ref.current) createTextReveal(title2Ref.current, 0.2);
        if (subtitleRef.current) createReveal(subtitleRef.current, 'up', 0.4);
        if (ctaRef.current) createReveal(ctaRef.current, 'up', 0.5);
        if (imageRef.current) createReveal(imageRef.current, 'left', 0.6);
    }, []);

    return (
        <section className="relative min-h-screen pt-32 pb-16 flex items-center overflow-hidden">
            {/* Background Architectural Grid Pattern */}
            <div
                className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, var(--color-text) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-text) 1px, transparent 1px)
          `,
                    backgroundSize: '4rem 4rem',
                }}
            />

            <div className="container-wide relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                {/* Typographic Hero Block */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                    <div className="space-y-2 overflow-hidden">
                        <h1 ref={title1Ref} className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-display font-bold text-[var(--color-text)] tracking-tighter mix-blend-multiply">
                            CLINICAL DEPTH.
                        </h1>
                        <h1 ref={title2Ref} className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-display font-bold text-[var(--color-primary)] tracking-tighter mix-blend-multiply">
                            SYSTEMIC SCALE.
                        </h1>
                    </div>

                    <p ref={subtitleRef} className="text-lg md:text-xl text-[var(--color-text)] font-body max-w-3xl leading-relaxed">
                        Speech-Language Pathologist turned Full Stack Developer. I build the next generation of digital tools for clinicians and researchers — interactive applications, agentic AI systems, and purpose-built healthcare technology. No templates. No compromises.
                    </p>

                    <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 pt-4">
                        <a href="#services" className="btn-primary">
                            View Capabilities
                        </a>
                        <a href="#playground" className="btn-secondary">
                            Try Interactive Demos
                        </a>
                    </div>

                    {/* Social Proof Badges */}
                    <div className="pt-12 flex flex-wrap gap-3">
                        <span className="badge-mono">Full Stack Dev</span>
                        <span className="badge-mono">CCC-SLP</span>
                        <span className="badge-mono">Healthcare Tech</span>
                    </div>
                </div>

                {/* Abstract Structural Element */}
                <div ref={imageRef} className="lg:col-span-5 relative h-[500px] lg:h-[650px] w-full mt-12 lg:mt-0">
                    <div className="absolute top-0 right-0 w-[90%] h-[90%] bg-[var(--color-secondary)] card-outer" />
                    <div className="absolute bottom-0 left-0 w-[90%] h-[90%] bg-[var(--color-text)] card-outer overflow-hidden">
                        <div className="w-full h-full opacity-85 mix-blend-screen bg-[url('/brain-circuit.svg')] bg-cover bg-center bg-no-repeat" />
                    </div>
                </div>
            </div>
        </section>
    );
}

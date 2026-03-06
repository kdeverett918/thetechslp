import { useEffect, useRef, useState, useCallback } from 'react';
import { createReveal } from '../utils/animations';
import { MonitorPlay, Code2, Database, BrainCircuit, Check } from 'lucide-react';

const services = [
    {
        icon: MonitorPlay,
        title: 'Clinical UX/UI Design',
        accent: 'var(--color-primary)',
        description: 'Interfaces shaped by workflow mapping, accessibility standards, and direct clinician feedback.',
        features: [
            'Accessibility-first design systems',
            'Clinician journey mapping',
            'Responsive prototyping in Figma',
            'Usability testing with practitioners',
        ],
    },
    {
        icon: Code2,
        title: 'Custom Web Applications',
        accent: 'var(--color-secondary)',
        description: 'Full-stack applications built with modern React, TypeScript, and serverless infrastructure. Fast, scalable, production-ready.',
        features: [
            'React / Next.js / TypeScript',
            'Real-time data & WebSockets',
            'Progressive web app support',
            'CI/CD deployment pipelines',
        ],
    },
    {
        icon: Database,
        title: 'Technical Infrastructure',
        accent: 'var(--color-primary)',
        description: 'Backend systems that don\'t break at scale. Database architecture, APIs, and integrations built on proven platforms.',
        features: [
            'PostgreSQL & Supabase',
            'RESTful & GraphQL APIs',
            'Authentication, permissions, and HIPAA-aware patterns',
            'Cloud infrastructure (AWS, Vercel)',
        ],
    },
    {
        icon: BrainCircuit,
        title: 'AI Integration Strategy',
        accent: 'var(--color-secondary)',
        description: 'Purposeful AI implementation for drafting, retrieval, and workflow support that stays inside clinician review.',
        features: [
            'LLM-powered clinical assistants',
            'RAG pipelines & vector search',
            'Agentic workflow automation',
            'AI output validation & safety testing',
        ],
    },
];

export default function Services() {
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    useEffect(() => {
        if (headerRef.current) createReveal(headerRef.current, 'up', 0.1);

        if (gridRef.current) {
            const cards = gridRef.current.children;
            Array.from(cards).forEach((card, index) => {
                createReveal(card, 'up', 0.2 + index * 0.12);
            });
        }
    }, []);

    return (
        <section id="services" className="section-padding bg-[var(--color-surface)] relative">
            <div className="container-wide">

                {/* Section Header */}
                <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-24">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-[2px] bg-[var(--color-primary)]" />
                        <span className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)]">What I Do</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text)] tracking-tight mb-6">
                        CAPABILITIES
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--color-text-muted)] font-body leading-relaxed">
                        I build digital systems for real clinical and educational workflows, from intake tools and learning platforms to carefully reviewed AI-assisted experiences.
                    </p>
                </div>

                {/* 2x2 Bento Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        const isHovered = hoveredIndex === index;

                        return (
                            <div
                                key={index}
                                className="group relative border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] bg-[var(--color-bg)] overflow-hidden"
                                style={{
                                    boxShadow: isHovered ? 'var(--shadow-solid-lg)' : 'var(--shadow-solid-sm)',
                                    transform: isHovered ? 'translate(-3px, -3px)' : 'translate(0, 0)',
                                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onMouseMove={handleMouseMove}
                            >
                                {/* Cursor-following spotlight glow */}
                                {isHovered && (
                                    <div
                                        className="pointer-events-none absolute inset-0 z-0 opacity-30 transition-opacity duration-300"
                                        style={{
                                            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${service.accent}, transparent 70%)`,
                                        }}
                                    />
                                )}

                                {/* Accent bar at top */}
                                <div
                                    className="h-1.5 w-full transition-all duration-500 relative z-10"
                                    style={{
                                        background: isHovered
                                            ? `linear-gradient(90deg, ${service.accent}, ${service.accent}00)`
                                            : `linear-gradient(90deg, ${service.accent}40, ${service.accent}00)`,
                                    }}
                                />

                                <div className="p-8 lg:p-10 relative z-10">
                                    {/* Icon + Title Row */}
                                    <div className="flex items-start gap-5 mb-6">
                                        <div
                                            className="shrink-0 p-4 border-[length:var(--border-width-base)] border-[var(--color-text)] rounded-[var(--radius-md)] transition-all duration-300"
                                            style={{
                                                backgroundColor: isHovered ? service.accent : 'var(--color-surface)',
                                                boxShadow: 'var(--shadow-solid-sm)',
                                            }}
                                        >
                                            <Icon
                                                className="w-7 h-7 transition-colors duration-300"
                                                style={{
                                                    color: isHovered ? 'white' : service.accent,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-display font-bold text-[var(--color-text)] tracking-tight">
                                                {service.title}
                                            </h3>
                                            <p className="text-[var(--color-text-muted)] font-body leading-relaxed mt-2">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feature List */}
                                    <div className="space-y-3 ml-1">
                                        {service.features.map((feature, fIndex) => (
                                            <div
                                                key={fIndex}
                                                className="flex items-center gap-3 text-[var(--color-text)] font-body text-sm"
                                                style={{
                                                    opacity: isHovered ? 1 : 0.7,
                                                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                                                    transition: `all 0.3s ease ${fIndex * 0.05}s`,
                                                }}
                                            >
                                                <Check
                                                    className="w-4 h-4 shrink-0"
                                                    style={{ color: service.accent }}
                                                />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

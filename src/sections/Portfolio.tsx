import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { createReveal } from '../utils/animations';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

const projects = [
    {
        title: 'SLP Clinical Tools',
        category: 'Public Resource',
        description: 'A free, open-access platform for medical SLPs. Features lightning-fast vector search for instant semantic querying across thousands of clinical resources — built for speed and daily clinical use.',
        stack: ['React', 'Next.js', 'Tailwind', 'Vector DB'],
        link: 'https://slpclinicaltools.com',
    },
    {
        title: 'Interactive Patient Portal',
        category: 'Patient-Facing Application',
        description: 'A patient engagement platform with real-time progress tracking, agentic AI assistants that adapt to individual performance, and interactive data visualizations that make clinical outcomes tangible.',
        stack: ['React', 'Supabase', 'PostgreSQL', 'Agentic AI'],
        link: '#',
    },
    {
        title: 'VoiceIQ',
        category: 'Academic Learning Platform',
        description: 'An interactive educational platform built in collaboration with university faculty. Designed to transform how speech pathology students engage with complex clinical material through dynamic, AI-enhanced learning experiences.',
        stack: ['TypeScript', 'React', 'Tailwind', 'AI/ML'],
        link: 'https://voiceiq.onrender.com',
    },
    {
        title: 'Dysphagia Lab',
        category: 'Education Prototype',
        description: 'An interactive anatomy learning platform for SLP students and clinicians. Progressive modules with 3D models, scaffolded instruction, quizzes, and clinical reasoning exercises — from oral cavity fundamentals to laryngeal mastery.',
        stack: ['Next.js', 'React', '3D Models'],
        link: 'https://dysphagialab.onrender.com',
    },
    {
        title: 'Informed Consent Tool',
        category: 'Clinical Workflow',
        description: 'A guided informed consent platform for dysphagia clinicians. Step-by-step capacity assessment, risk disclosure, teach-back verification, and HIPAA-compliant documentation — built on the Dysphagia Outreach Project\'s evidence-based checklist.',
        stack: ['Next.js', 'React', 'TypeScript'],
        link: 'https://consent-1by6.onrender.com',
    },
    {
        title: 'SLP Prompt Library',
        category: 'Clinical Resource',
        description: 'A curated collection of evidence-based prompt structures for SLPs. Copy-paste ready prompts for clinical documentation, patient education, research, and more.',
        stack: ['React', 'TypeScript', 'EBP'],
        link: '/prompts',
    },
];

export default function Portfolio() {
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (headerRef.current) createReveal(headerRef.current, 'up', 0.1);

        if (gridRef.current) {
            const cards = gridRef.current.children;
            Array.from(cards).forEach((card, index) => {
                createReveal(card, 'up', 0.2 + index * 0.15);
            });
        }
    }, []);

    return (
        <section id="portfolio" className="section-padding bg-[var(--color-surface)]">
            <div className="container-wide">

                <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-24">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-[2px] bg-[var(--color-primary)]" />
                        <span className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)]">Portfolio</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text)] tracking-tight mb-6">
                        SELECTED WORK
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--color-text-muted)] font-body leading-relaxed">
                        Real projects at the intersection of clinical expertise and modern engineering.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => {
                        const isInternal = project.link.startsWith('/');
                        const isExternal = project.link !== '#' && !isInternal;

                        const cardContent = (
                            <>
                                {/* Category + Title */}
                                <div>
                                    <div className="mb-4 text-[var(--color-secondary)] font-mono text-sm tracking-widest uppercase font-bold">
                                        {project.category}
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-text)] tracking-tight mb-4 group-hover:text-[var(--color-primary)] transition-colors flex items-start gap-2">
                                        {project.title}
                                        {(isExternal || isInternal) && (
                                            <ArrowUpRight className="w-6 h-6 shrink-0 mt-1 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out" />
                                        )}
                                    </h3>

                                    <p className="text-[var(--color-text-muted)] font-body leading-relaxed mb-8">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Stack + Link */}
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.stack.map(tech => (
                                            <span key={tech} className="px-3 py-1 bg-[var(--color-surface)] text-[var(--color-text)] text-xs font-mono font-bold border border-[var(--color-border)] rounded-[var(--radius-sm)]">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {isExternal && (
                                        <div className="flex items-center gap-2 text-sm font-mono font-bold text-[var(--color-primary)] group-hover:underline">
                                            <ExternalLink className="w-4 h-4" />
                                            Visit Live Site
                                        </div>
                                    )}
                                    {isInternal && (
                                        <div className="flex items-center gap-2 text-sm font-mono font-bold text-[var(--color-primary)] group-hover:underline">
                                            <ArrowUpRight className="w-4 h-4" />
                                            Explore Prompts
                                        </div>
                                    )}
                                </div>
                            </>
                        );

                        if (isInternal) {
                            return (
                                <Link
                                    key={index}
                                    to={project.link}
                                    className="group card-solid p-8 lg:p-10 flex flex-col justify-between"
                                >
                                    {cardContent}
                                </Link>
                            );
                        }

                        return (
                            <a
                                key={index}
                                href={project.link}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noreferrer' : undefined}
                                className="group card-solid p-8 lg:p-10 flex flex-col justify-between"
                            >
                                {cardContent}
                            </a>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

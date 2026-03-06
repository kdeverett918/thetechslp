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
        category: 'Private Client Work',
        description: 'A private patient engagement product focused on progress visibility, guided workflows, and clearer communication for patients and care teams. Case study details available on request.',
        stack: ['React', 'Supabase', 'PostgreSQL', 'Agentic AI'],
        link: null,
    },
    {
        title: 'VoiceIQ',
        category: 'Academic Learning Platform',
        description: 'An interactive educational platform built in collaboration with university faculty. Designed to transform how speech pathology students engage with complex clinical material through dynamic, AI-enhanced learning experiences.',
        stack: ['TypeScript', 'React', 'Tailwind', 'AI/ML'],
        link: 'https://voiceiq.onrender.com',
    },
    {
        title: 'Anatomy Lab',
        category: 'Education Prototype',
        description: 'An interactive anatomy learning platform for SLP students and clinicians. Progressive modules with 3D models, scaffolded instruction, quizzes, and clinical reasoning exercises — from oral cavity fundamentals to laryngeal mastery.',
        stack: ['Next.js', 'React', '3D Models'],
        link: 'https://dysphagialab.onrender.com',
    },
    {
        title: 'Informed Consent Tool',
        category: 'Clinical Workflow',
        description: 'Built in collaboration with the Dysphagia Outreach Project, this guided consent platform walks clinicians through capacity assessment, risk disclosure, and teach-back verification with privacy-sensitive documentation workflows.',
        stack: ['Next.js', 'React', 'TypeScript'],
        link: 'https://consent-1by6.onrender.com',
    },
    {
        title: 'SLP Prompt Library',
        category: 'Clinical Resource',
        description: '40+ free prompt templates built for medical SLPs across 15 clinical domains, now paired with beginner guidance on LLMs, safer prompting habits, and a dated model-pricing reference.',
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
                        const link = project.link;
                        const isInternal = typeof link === 'string' && link.startsWith('/');
                        const isExternal = typeof link === 'string' && !isInternal;

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
                                    {!project.link && (
                                        <div className="flex items-center gap-2 text-sm font-mono font-bold text-[var(--color-text-muted)]">
                                            Private case study on request
                                        </div>
                                    )}
                                </div>
                            </>
                        );

                        if (typeof link === 'string' && link.startsWith('/')) {
                            return (
                                <Link
                                    key={index}
                                    to={link}
                                    className="group card-solid p-8 lg:p-10 flex flex-col justify-between"
                                >
                                    {cardContent}
                                </Link>
                            );
                        }

                        if (typeof link === 'string') {
                            return (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group card-solid p-8 lg:p-10 flex flex-col justify-between"
                                >
                                    {cardContent}
                                </a>
                            );
                        }

                        return (
                            <article
                                key={index}
                                className="group card-solid p-8 lg:p-10 flex flex-col justify-between"
                            >
                                {cardContent}
                            </article>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

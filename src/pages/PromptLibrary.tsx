import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Search, Copy, Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { createReveal } from '../utils/animations';
import prompts from '../data/prompts.json';

const categories = [...new Set(prompts.map(p => p.category))];

export default function PromptLibrary() {
    const [search, setSearch] = useState('');
    const [activeCategories, setActiveCategories] = useState<string[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (headerRef.current) createReveal(headerRef.current, 'up', 0.1);
        if (searchRef.current) createReveal(searchRef.current, 'up', 0.2);
    }, []);

    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.children;
        Array.from(cards).forEach((card, index) => {
            createReveal(card, 'up', 0.1 + index * 0.05);
        });
    }, [search, activeCategories]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return prompts.filter(p => {
            const matchesSearch = !q ||
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q));
            const matchesCategory = activeCategories.length === 0 ||
                activeCategories.includes(p.category);
            return matchesSearch && matchesCategory;
        });
    }, [search, activeCategories]);

    const toggleCategory = (cat: string) => {
        setActiveCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const copyPrompt = async (id: string, text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

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

            <div className="container-wide pt-28 pb-24">
                {/* Header */}
                <div ref={headerRef} className="max-w-3xl mb-12">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-[2px] bg-[var(--color-primary)]" />
                        <span className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)]">
                            Clinical Resource
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--color-text)] tracking-tight mb-6">
                        SLP PROMPT LIBRARY
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--color-text-muted)] font-body leading-relaxed">
                        Copy-paste ready prompts for evidence-based clinical practice.
                        Each prompt is designed to work with any LLM to support SLP workflows across {categories.length} domains.
                    </p>
                    <div className="mt-4 font-mono text-sm text-[var(--color-secondary)] font-bold">
                        {prompts.length} prompts available
                    </div>
                </div>

                {/* Search + Filters */}
                <div ref={searchRef} className="mb-12 space-y-6">
                    {/* Search bar */}
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search prompts by title, description, or tag..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 bg-[var(--color-surface)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category chips */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => {
                            const isActive = activeCategories.includes(cat);
                            const count = prompts.filter(p => p.category === cat).length;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-mono font-bold tracking-wide border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-full)] transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] shadow-[var(--shadow-solid-sm)]'
                                            : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                                    }`}
                                >
                                    {cat}
                                    <span className={`text-xs ${isActive ? 'opacity-80' : 'text-[var(--color-text-muted)]'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                        {activeCategories.length > 0 && (
                            <button
                                onClick={() => setActiveCategories([])}
                                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-mono font-bold text-[var(--color-primary)] hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    {/* Results count */}
                    <p className="font-mono text-sm text-[var(--color-text-muted)]">
                        Showing {filtered.length} of {prompts.length} prompts
                    </p>
                </div>

                {/* Prompt Cards Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(prompt => {
                        const isExpanded = expandedId === prompt.id;
                        const isCopied = copiedId === prompt.id;

                        return (
                            <div
                                key={prompt.id}
                                className={`card-solid p-6 flex flex-col ${isExpanded ? 'md:col-span-2 xl:col-span-3' : ''}`}
                            >
                                {/* Category badge */}
                                <div className="mb-3">
                                    <span className="badge-mono">
                                        {prompt.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-display font-bold text-[var(--color-text)] tracking-tight mb-2">
                                    {prompt.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[var(--color-text-muted)] font-body text-sm leading-relaxed mb-4 flex-grow">
                                    {prompt.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {prompt.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-[var(--radius-sm)]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Expanded prompt text */}
                                {isExpanded && (
                                    <div className="mb-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-x-auto">
                                        <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-text)] leading-relaxed">
                                            {prompt.prompt}
                                        </pre>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]/20">
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                                        className="flex items-center gap-1.5 text-sm font-mono font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="w-4 h-4" />
                                                Collapse
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4" />
                                                View Prompt
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => copyPrompt(prompt.id, prompt.prompt)}
                                        className={`flex items-center gap-1.5 text-sm font-mono font-bold transition-colors ${
                                            isCopied
                                                ? 'text-[var(--color-secondary)]'
                                                : 'text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]'
                                        }`}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy Prompt
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl font-display font-bold text-[var(--color-text)] mb-2">
                            No prompts found
                        </p>
                        <p className="text-[var(--color-text-muted)] font-body">
                            Try adjusting your search or clearing the category filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

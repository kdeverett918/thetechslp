import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Search, Copy, Check, ChevronDown, ChevronUp, X, ShieldAlert, Wand2, Lightbulb } from 'lucide-react';
import { createReveal } from '../utils/animations';
import prompts from '../data/prompts.json';

const categories = [...new Set(prompts.map(p => p.category))];

const SETTINGS = [
    'Acute Care Hospital',
    'Inpatient Rehabilitation',
    'Outpatient Clinic',
    'Skilled Nursing Facility',
    'Home Health',
    'School-Based',
    'Early Intervention',
    'Telepractice',
    'Private Practice',
    'University Clinic',
];

const SPECIALTIES = [
    'Dysphagia',
    'Aphasia & Language',
    'Motor Speech Disorders',
    'Voice Disorders',
    'Fluency',
    'Pediatric Speech-Language',
    'Cognitive-Communication',
    'AAC',
    'Bilingual/Multilingual',
];

const TASKS = [
    'Write documentation (eval, progress note, discharge)',
    'Create a treatment plan with goals',
    'Generate patient/family education materials',
    'Prepare for a difficult conversation',
    'Develop therapy activities',
    'Summarize research for clinical application',
    'Draft a letter of medical necessity',
    'Build an IEP with measurable goals',
    'Design a home practice program',
    'Create training materials for staff/students',
];

const OUTPUT_FORMATS = [
    'Clinical report / chart note',
    'Patient-friendly handout (6th grade reading level)',
    'Bullet-point summary',
    'Step-by-step protocol',
    'Table or comparison chart',
    'Email or letter',
    'Slide deck outline',
    'Checklist',
];

const PROMPTING_TIPS = [
    {
        title: 'Set the clinical context',
        description: 'Tell the AI your setting, patient population, and the specific clinical scenario. "You are an SLP in an acute care hospital evaluating a post-stroke patient" is far better than "help me with dysphagia."',
    },
    {
        title: 'Define the AI\'s role',
        description: 'Start with "You are an ASHA-certified speech-language pathologist specializing in..." This grounds the AI in clinical expertise and produces more relevant outputs.',
    },
    {
        title: 'Specify the output format',
        description: 'Request a specific structure: "Format as a SOAP note," "Create a bulleted checklist," or "Write at a 6th-grade reading level." This prevents generic, unfocused responses.',
    },
    {
        title: 'Reference clinical frameworks',
        description: 'Mention specific frameworks like IDDSI, LPAA, SMART goals, PICO, or SSI-4. The AI will produce more accurate, standards-aligned content when guided by established models.',
    },
    {
        title: 'Never paste PHI',
        description: 'Always de-identify patient data before using any AI tool. Replace names with [PATIENT], dates with [DATE], and facilities with [FACILITY]. See the HIPAA prompts in this library for a full checklist.',
    },
    {
        title: 'Iterate and refine',
        description: 'Your first prompt rarely produces the perfect result. Review the output, identify what\'s missing, and ask follow-up questions: "Add compensatory strategies" or "Make the language less technical."',
    },
];

const normalizeSearchText = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

export default function PromptLibrary() {
    const [search, setSearch] = useState('');
    const [activeCategories, setActiveCategories] = useState<string[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [tipsOpen, setTipsOpen] = useState(false);
    const [coachOpen, setCoachOpen] = useState(false);
    const [coachStep, setCoachStep] = useState(0);
    const [coachSetting, setCoachSetting] = useState('');
    const [coachSpecialty, setCoachSpecialty] = useState('');
    const [coachTask, setCoachTask] = useState('');
    const [coachFormat, setCoachFormat] = useState('');
    const [coachCopied, setCoachCopied] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.title = 'SLP Prompt Library — The Tech SLP';
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
        const normalizedQuery = normalizeSearchText(search.trim());
        const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

        return prompts.filter(p => {
            const searchableText = normalizeSearchText([
                p.title,
                p.description,
                p.category,
                p.prompt,
                p.tags.join(' '),
            ].join(' '));

            const matchesSearch = queryTerms.length === 0 ||
                queryTerms.every(term => searchableText.includes(term));
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

    const generatedPrompt = useMemo(() => {
        if (!coachSetting && !coachSpecialty && !coachTask && !coachFormat) return '';
        const parts: string[] = [];
        if (coachSpecialty) {
            parts.push(`You are an ASHA-certified speech-language pathologist specializing in ${coachSpecialty}.`);
        } else {
            parts.push('You are an ASHA-certified speech-language pathologist.');
        }
        if (coachSetting) {
            parts.push(`You work in a ${coachSetting} setting.`);
        }
        if (coachTask) {
            parts.push(`\nTask: ${coachTask}`);
        }
        parts.push('\nInclude:');
        parts.push('1. [Specific detail or section you need]');
        parts.push('2. [Another specific requirement]');
        parts.push('3. [Data, evidence, or framework to reference]');
        parts.push('\nPatient/Client Profile:');
        parts.push('[De-identified details — age, diagnosis, relevant history]');
        if (coachFormat) {
            parts.push(`\nFormat the output as: ${coachFormat}`);
        }
        parts.push('\nIMPORTANT: Do not include any real patient names, dates of birth, or identifying information in your response.');
        return parts.join('\n');
    }, [coachSetting, coachSpecialty, coachTask, coachFormat]);

    const copyCoachPrompt = async () => {
        if (!generatedPrompt) return;
        await navigator.clipboard.writeText(generatedPrompt);
        setCoachCopied(true);
        setTimeout(() => setCoachCopied(false), 2000);
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
                <div ref={headerRef} className="max-w-3xl mb-8">
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

                {/* HIPAA Banner */}
                <div className="mb-8 p-4 bg-[var(--color-primary)]/10 border-[length:var(--border-width-base)] border-[var(--color-primary)]/30 rounded-[var(--radius-md)] flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <div>
                        <p className="font-display font-bold text-[var(--color-text)] text-sm">
                            Do not paste PHI into any AI tool.
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)] font-body mt-1">
                            De-identify all patient data before use. Replace names, dates, MRNs, and facility names with placeholders like [PATIENT], [DATE], [FACILITY].
                        </p>
                    </div>
                </div>

                {/* Prompt Coach Section */}
                <div className="mb-8 space-y-4">
                    {/* Build Your Own Prompt */}
                    <div className="border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden bg-[var(--color-secondary)]/5">
                        <button
                            onClick={() => setCoachOpen(!coachOpen)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-secondary)]/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-secondary)] flex items-center justify-center">
                                    <Wand2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-[var(--color-text)] text-lg">Build Your Own Prompt</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body">4-step guided builder for custom clinical prompts</p>
                                </div>
                            </div>
                            {coachOpen ? <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />}
                        </button>

                        {coachOpen && (
                            <div className="p-5 pt-0 space-y-6">
                                {/* Steps */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Step 1: Setting */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">1</span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">Clinical Setting</span>
                                        </div>
                                        <select
                                            value={coachSetting}
                                            onChange={e => { setCoachSetting(e.target.value); setCoachStep(Math.max(coachStep, 1)); }}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a setting...</option>
                                            {SETTINGS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    {/* Step 2: Specialty */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">2</span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">Specialty Area</span>
                                        </div>
                                        <select
                                            value={coachSpecialty}
                                            onChange={e => { setCoachSpecialty(e.target.value); setCoachStep(Math.max(coachStep, 2)); }}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a specialty...</option>
                                            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    {/* Step 3: Task */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">3</span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">Task</span>
                                        </div>
                                        <select
                                            value={coachTask}
                                            onChange={e => { setCoachTask(e.target.value); setCoachStep(Math.max(coachStep, 3)); }}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a task...</option>
                                            {TASKS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    {/* Step 4: Output Format */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">4</span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">Output Format</span>
                                        </div>
                                        <select
                                            value={coachFormat}
                                            onChange={e => { setCoachFormat(e.target.value); setCoachStep(4); }}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a format...</option>
                                            {OUTPUT_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Generated Prompt Preview */}
                                {generatedPrompt && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">Your Generated Prompt</span>
                                            <button
                                                onClick={copyCoachPrompt}
                                                className={`flex items-center gap-1.5 text-sm font-mono font-bold transition-colors ${
                                                    coachCopied
                                                        ? 'text-[var(--color-secondary)]'
                                                        : 'text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]'
                                                }`}
                                            >
                                                {coachCopied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Prompt</>}
                                            </button>
                                        </div>
                                        <div className="p-4 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)]">
                                            <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-text)] leading-relaxed">
                                                {generatedPrompt}
                                            </pre>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-muted)] font-body">
                                            Customize the bracketed sections with your de-identified clinical details before pasting into an AI tool.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Prompting Tips */}
                    <div className="border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
                        <button
                            onClick={() => setTipsOpen(!tipsOpen)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-text)] flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-[var(--color-text)] text-lg">Prompting Tips for Clinicians</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body">6 strategies for getting better AI outputs in clinical work</p>
                                </div>
                            </div>
                            {tipsOpen ? <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />}
                        </button>

                        {tipsOpen && (
                            <div className="p-5 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PROMPTING_TIPS.map((tip, i) => (
                                        <div key={i} className="p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)]/30">
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <h3 className="font-display font-bold text-sm text-[var(--color-text)] mb-1">{tip.title}</h3>
                                                    <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">{tip.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search + Filters */}
                <div ref={searchRef} className="mb-12 space-y-6">
                    {/* Search bar */}
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search the full prompt library (title, tags, and full prompt text)..."
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
                        const level = (prompt as { level?: string }).level;

                        return (
                            <div
                                key={prompt.id}
                                className={`card-solid p-6 flex flex-col ${isExpanded ? 'md:col-span-2 xl:col-span-3' : ''}`}
                            >
                                {/* Category badge + Level badge */}
                                <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className="badge-mono">
                                        {prompt.category}
                                    </span>
                                    {level === 'beginner' && (
                                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 rounded-[var(--radius-sm)]">
                                            Beginner-friendly
                                        </span>
                                    )}
                                    {level === 'advanced' && (
                                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded-[var(--radius-sm)]">
                                            Advanced
                                        </span>
                                    )}
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
                                    <div className="mb-4 space-y-3">
                                        {/* HIPAA reminder inside expanded card */}
                                        <div className="p-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[var(--radius-sm)] flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                                            <p className="text-xs text-[var(--color-text-muted)] font-body">
                                                Remember: De-identify all patient data before pasting into any AI tool.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-x-auto">
                                            <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-text)] leading-relaxed">
                                                {prompt.prompt}
                                            </pre>
                                        </div>
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

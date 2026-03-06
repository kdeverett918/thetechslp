import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
    ArrowLeft,
    BookOpenText,
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    Lightbulb,
    Search,
    ShieldAlert,
    ShieldCheck,
    TriangleAlert,
    Wand2,
    X,
} from 'lucide-react';
import { createReveal } from '../utils/animations';
import { buildSearchQuery, matchesSearchQuery } from '../utils/promptSearch';
import prompts from '../data/prompts.json';

const categories = [...new Set(prompts.map((prompt) => prompt.category))];

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
    'Draft documentation from de-identified notes',
    'Create a treatment plan with measurable goals',
    'Generate patient or caregiver education materials',
    'Prepare for a difficult conversation',
    'Develop therapy activities',
    'Summarize research for clinical application',
    'Draft a letter of medical necessity',
    'Build an IEP with measurable goals',
    'Design a home practice program',
    'Create training materials for staff or students',
];

const AUDIENCES = [
    'Another clinician',
    'Patient or family caregiver',
    'School or interdisciplinary team',
    'Payer or physician reviewer',
    'Graduate student or staff trainee',
];

const OUTPUT_FORMATS = [
    'Clinical note or report',
    'Patient-friendly handout (6th grade reading level)',
    'Bullet summary',
    'Step-by-step protocol',
    'Table or comparison chart',
    'Email or letter',
    'Slide deck outline',
    'Checklist',
];

const LLM_BASICS = [
    {
        title: 'What AI chat tools do well',
        description:
            'Drafting, summarizing, rewriting, organizing, brainstorming, and explaining source material you already trust.',
    },
    {
        title: 'What AI chat tools should not decide',
        description:
            'Diagnosis, payer/legal advice, unverified citations, and filling in missing clinical facts without supervision.',
    },
    {
        title: 'Why they can sound sure and still be wrong',
        description:
            'These tools predict likely text. If your prompt is vague or the source material is thin, they can generate fluent but wrong details.',
    },
    {
        title: 'Best beginner mindset',
        description:
            'Treat the model like a fast drafting assistant, not a licensed clinician. Useful outputs still need human review and context.',
    },
];

const PROMPT_FORMULA = [
    {
        label: 'Task',
        description: 'Name the exact job: summarize, rewrite, draft, compare, brainstorm, or turn notes into a template.',
    },
    {
        label: 'Context',
        description: 'Add the clinical setting, goal area, source material, and what the model should pay attention to.',
    },
    {
        label: 'Audience',
        description: 'Say who the output is for: clinician, caregiver, payer reviewer, school team, or student.',
    },
    {
        label: 'Constraints',
        description: 'Set reading level, length, tone, privacy guardrails, and a “use only the information provided” rule.',
    },
    {
        label: 'Format',
        description: 'Request a SOAP note, handout, checklist, table, email, or lesson plan so the result is easy to use.',
    },
    {
        label: 'Verification',
        description: 'Tell it to ask follow-up questions, state uncertainty, and mark anything requiring clinician confirmation.',
    },
];

const SAFE_TASKS = [
    'Turn de-identified session notes into a draft SOAP note that you will edit.',
    'Rewrite patient education at a lower reading level.',
    'Summarize a paper abstract or policy excerpt you pasted in.',
    'Generate therapy activity ideas for a goal you already set.',
    'Draft a caregiver handout or staff training checklist from approved source material.',
];

const VERIFY_FIRST_TASKS = [
    'Choosing diagnoses, ICD-10 codes, or service eligibility without clinician confirmation.',
    'Inventing citations, payer rules, modifiers, state licensure guidance, or legal advice.',
    'Making diet, device, or treatment recommendations without enough data or human review.',
    'Producing patient-facing guidance that could change medical care without a clinician check.',
    'Using PHI in a tool your employer has not approved for that use.',
];

const BEGINNER_STARTER_IDS = new Set([
    'dysphagia-patient-education',
    'voice-hygiene-program',
    'aphasia-progress-note',
    'peds-language-activities',
    'peds-parent-coaching',
    'doc-soap-note',
    'hipaa-phi-deidentification',
    'prompt-critique-coach',
    'ask-clarifying-questions-first',
    'model-chooser-slp-task',
    'source-material-only-draft',
    'output-hallucination-check',
    'clinical-document-qa-checklist',
    'reading-level-rewriter',
    'research-triage-summary',
    'interdisciplinary-email-draft',
    'iep-meeting-prep-guide',
]);

const VERIFY_CLOSELY_IDS = new Set([
    'dysphagia-diet-rationale',
    'dysphagia-treatment-plan',
    'motor-speech-differential',
    'doc-evaluation-report',
    'doc-letter-medical-necessity',
    'telepractice-troubleshooting',
    'bilingual-difference-disorder',
    'aac-assessment',
]);

const PROVIDER_GUIDE = [
    {
        provider: 'ChatGPT / OpenAI',
        bestFor: 'A strong all-purpose starting point for writing help, brainstorming, and cleaning up rough drafts.',
        goodFit: 'You want one familiar tool that can cover most everyday SLP prompting tasks.',
        note: 'A practical default if you are new to AI tools. Still verify anything clinical, billing-related, or policy-specific.',
        links: [{ label: 'ChatGPT plans', href: 'https://chatgpt.com/pricing' }],
    },
    {
        provider: 'Claude / Anthropic',
        bestFor: 'Longer writing, thoughtful revisions, and calm, readable prose.',
        goodFit: 'You want help rewriting handouts, emails, reflections, or longer clinician-facing drafts.',
        note: 'Often feels strong for editing and synthesis, but it can still miss facts or overstate confidence.',
        links: [{ label: 'Claude plans', href: 'https://www.anthropic.com/pricing' }],
    },
    {
        provider: 'Gemini / Google',
        bestFor: 'Google-heavy workflows and clinicians who already live in Docs, Gmail, or Drive.',
        goodFit: 'Your workplace already uses Google tools and you want something that feels familiar.',
        note: 'Convenient for Google users, but you should still check privacy settings and verify web-based summaries.',
        links: [{ label: 'Gemini subscriptions', href: 'https://gemini.google/subscriptions/' }],
    },
    {
        provider: 'Perplexity',
        bestFor: 'Research-heavy tasks where you want quick web results and links to read next.',
        goodFit: 'You are comparing tools, articles, or policies and want help finding sources.',
        note: 'Best used for research support rather than final wording. Open the sources yourself before trusting the summary.',
        links: [
            {
                label: 'Perplexity plans',
                href: 'https://www.perplexity.ai/help-center/en/articles/10354919-which-subscription-plan-is-right-for-me',
            },
        ],
    },
];

const PROMPTING_TIPS = [
    {
        title: 'Start with the task, not the persona',
        description:
            '“Draft a caregiver handout from these notes” is more reliable than telling the model it is a licensed clinician.',
    },
    {
        title: 'Paste source material',
        description:
            'If you need accuracy, give the note, article abstract, policy excerpt, or assessment summary and say “use only this information.”',
    },
    {
        title: 'Set constraints early',
        description:
            'Specify reading level, tone, length, format, and what the model should avoid so it does not drift into generic filler.',
    },
    {
        title: 'Ask for follow-up questions',
        description:
            'Tell the model to ask when important details are missing instead of guessing diagnoses, citations, or payer requirements.',
    },
    {
        title: 'Add a verification line',
        description:
            'For higher-risk work, add: “Do not invent citations, codes, laws, payer rules, or state requirements. Mark anything needing clinician confirmation.”',
    },
    {
        title: 'Protect privacy beyond names',
        description:
            'Use minimum necessary information and remove quasi-identifiers too, not just names, dates, and facility names.',
    },
];

export default function PromptLibrary() {
    const [search, setSearch] = useState('');
    const [activeCategories, setActiveCategories] = useState<string[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [basicsOpen, setBasicsOpen] = useState(true);
    const [modelsOpen, setModelsOpen] = useState(false);
    const [safetyOpen, setSafetyOpen] = useState(false);
    const [coachOpen, setCoachOpen] = useState(false);
    const [tipsOpen, setTipsOpen] = useState(false);
    const [coachSetting, setCoachSetting] = useState('');
    const [coachSpecialty, setCoachSpecialty] = useState('');
    const [coachTask, setCoachTask] = useState('');
    const [coachAudience, setCoachAudience] = useState('');
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
        if (headerRef.current) {
            createReveal(headerRef.current, 'up', 0.1);
        }
        if (searchRef.current) {
            createReveal(searchRef.current, 'up', 0.2);
        }
    }, []);

    useEffect(() => {
        if (!gridRef.current) {
            return;
        }

        const cards = gridRef.current.children;
        Array.from(cards).forEach((card, index) => {
            createReveal(card, 'up', 0.1 + index * 0.05);
        });
    }, [search, activeCategories]);

    const filtered = useMemo(() => {
        const searchQuery = buildSearchQuery(search.trim());

        return prompts.filter((prompt) => {
            const searchableText = [
                prompt.title,
                prompt.description,
                prompt.category,
                prompt.prompt,
                prompt.tags.join(' '),
            ].join(' ');

            const matchesSearch = matchesSearchQuery(searchQuery, searchableText);
            const matchesCategory =
                activeCategories.length === 0 || activeCategories.includes(prompt.category);

            return matchesSearch && matchesCategory;
        });
    }, [search, activeCategories]);

    const generatedPrompt = useMemo(() => {
        if (!coachSetting && !coachSpecialty && !coachTask && !coachAudience && !coachFormat) {
            return '';
        }

        const parts: string[] = [
            'Act as a clinical writing and brainstorming assistant supporting a licensed speech-language pathologist.',
        ];

        if (coachSetting) {
            parts.push(`Setting: ${coachSetting}`);
        }
        if (coachSpecialty) {
            parts.push(`Focus area: ${coachSpecialty}`);
        }
        if (coachTask) {
            parts.push(`Task: ${coachTask}`);
        }
        if (coachAudience) {
            parts.push(`Audience: ${coachAudience}`);
        }

        parts.push('\nUse only the information I provide.');
        parts.push('If critical information is missing, ask follow-up questions before drafting.');
        parts.push(
            'State uncertainty instead of guessing, especially for diagnoses, payer rules, state requirements, citations, or legal/compliance questions.'
        );

        parts.push('\nSource material:');
        parts.push('[Paste de-identified notes, policy text, article abstract, or session data here]');

        parts.push('\nConstraints:');
        parts.push('1. Keep the output within clinician review and current SLP scope.');
        parts.push('2. Do not invent citations, ICD-10 codes, CPT codes, payer requirements, or state rules.');
        parts.push('3. Mark anything requiring manual review as NEEDS CLINICIAN CONFIRMATION.');

        if (coachFormat) {
            parts.push(`\nOutput format: ${coachFormat}`);
        }

        parts.push('\nSuccess criteria:');
        parts.push(
            '[What would make this useful? e.g., chart-ready, concise, family-friendly, 6th-grade reading level, comparison table]'
        );

        parts.push('\nPrivacy reminder:');
        parts.push(
            'Use minimum necessary, de-identified information unless your employer-approved tool and policy explicitly allow more.'
        );

        return parts.join('\n');
    }, [coachAudience, coachFormat, coachSetting, coachSpecialty, coachTask]);

    const toggleCategory = (category: string) => {
        setActiveCategories((previous) =>
            previous.includes(category)
                ? previous.filter((currentCategory) => currentCategory !== category)
                : [...previous, category]
        );
    };

    const copyPrompt = async (id: string, text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const copyCoachPrompt = async () => {
        if (!generatedPrompt) {
            return;
        }

        await navigator.clipboard.writeText(generatedPrompt);
        setCoachCopied(true);
        setTimeout(() => setCoachCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <a
                href="#prompt-library-main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-[var(--color-text-on-primary)] focus:px-6 focus:py-3 focus:font-display focus:font-bold"
            >
                Skip to prompt library content
            </a>

            <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
                <div className="container-wide flex items-center h-16">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-display font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        The Tech SLP
                    </Link>
                </div>
            </header>

            <main id="prompt-library-main" className="container-wide pt-28 pb-24">
                <div ref={headerRef} className="max-w-4xl mb-8">
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
                        Beginner-friendly prompting guidance, de-identified clinical templates, and a plain-language
                        guide to choosing an AI chat tool for common SLP tasks.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)]">
                        <span>{prompts.length} prompts</span>
                        <span>{categories.length} categories</span>
                        <span>Updated March 5, 2026</span>
                    </div>
                </div>

                <div className="mb-8 p-5 bg-[var(--color-primary)]/10 border-[length:var(--border-width-base)] border-[var(--color-primary)]/30 rounded-[var(--radius-lg)] flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <p className="font-display font-bold text-[var(--color-text)] text-sm">
                            Use AI for drafting and thinking support, not as a substitute for clinical judgment.
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                            Do not paste PHI into non-approved tools. Follow minimum necessary, remove quasi-identifiers,
                            and only use employer-approved platforms when policy and required agreements allow it. This
                            page is educational, not legal or billing advice.
                        </p>
                    </div>
                </div>

                <div className="mb-8 space-y-4">
                    <div className="border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
                        <button
                            onClick={() => setBasicsOpen((current) => !current)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-text)] flex items-center justify-center">
                                    <BookOpenText className="w-5 h-5 text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-[var(--color-text)] text-lg">
                                        AI Tools 101 for SLPs
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body">
                                        What these tools do well, where they fail, and the prompt formula to start with
                                    </p>
                                </div>
                            </div>
                            {basicsOpen ? (
                                <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                            )}
                        </button>

                        {basicsOpen && (
                            <div className="p-5 pt-0 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {LLM_BASICS.map((item) => (
                                        <div
                                            key={item.title}
                                            className="p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)]/30"
                                        >
                                            <h3 className="font-display font-bold text-sm text-[var(--color-text)] mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 rounded-[var(--radius-md)]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="w-4 h-4 text-[var(--color-secondary)]" />
                                        <p className="font-display font-bold text-sm text-[var(--color-text)]">
                                            Starter prompt formula
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {PROMPT_FORMULA.map((item) => (
                                            <div
                                                key={item.label}
                                                className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)]/30"
                                            >
                                                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)] mb-1">
                                                    {item.label}
                                                </p>
                                                <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
                        <button
                            onClick={() => setModelsOpen((current) => !current)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-secondary)] flex items-center justify-center">
                                    <Search className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-[var(--color-text)] text-lg">
                                        How To Choose an AI Tool
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body">
                                        A simpler guide to the main chat tools most clinicians are likely to compare
                                    </p>
                                </div>
                            </div>
                            {modelsOpen ? (
                                <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                            )}
                        </button>

                        {modelsOpen && (
                            <div className="p-5 pt-0 space-y-4">
                                <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                    Most SLPs do not need advanced technical setup details or a long list of product
                                    comparisons. Start with one mainstream chat tool, use it for a low-risk task, and
                                    learn what fits your workflow before comparing anything more advanced.
                                </p>

                                <div className="overflow-x-auto border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                                    <table className="min-w-[900px] w-full text-sm">
                                        <thead className="bg-[var(--color-surface)] text-left">
                                            <tr className="border-b border-[var(--color-border)]">
                                                <th className="px-4 py-3 font-display text-[var(--color-text)]">Platform</th>
                                                <th className="px-4 py-3 font-display text-[var(--color-text)]">Usually best for</th>
                                                <th className="px-4 py-3 font-display text-[var(--color-text)]">Good fit if...</th>
                                                <th className="px-4 py-3 font-display text-[var(--color-text)]">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {PROVIDER_GUIDE.map((provider) => (
                                                <tr
                                                    key={provider.provider}
                                                    className="border-b border-[var(--color-border)]/40 align-top last:border-b-0"
                                                >
                                                    <td className="px-4 py-4 text-[var(--color-text)] font-body">
                                                        <div className="font-display font-bold mb-2">{provider.provider}</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {provider.links.map((link) => (
                                                                <a
                                                                    key={link.href}
                                                                    href={link.href}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-xs font-mono font-bold text-[var(--color-primary)] hover:underline"
                                                                >
                                                                    {link.label}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-[var(--color-text-muted)] font-body leading-relaxed">
                                                        {provider.bestFor}
                                                    </td>
                                                    <td className="px-4 py-4 text-[var(--color-text-muted)] font-body leading-relaxed">
                                                        {provider.goodFit}
                                                    </td>
                                                    <td className="px-4 py-4 text-[var(--color-text-muted)] font-body leading-relaxed">
                                                        {provider.note}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-4 bg-[var(--color-text)]/5 border border-[var(--color-border)]/40 rounded-[var(--radius-md)]">
                                    <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                        If you are just getting started, skip most technical comparisons. The better
                                        beginner move is to pick one tool, practice giving it clear instructions, and
                                        keep your clinical review standards high.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
                        <button
                            onClick={() => setSafetyOpen((current) => !current)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary)] flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-[var(--color-text)] text-lg">
                                        Safe vs. Unsafe AI Tasks
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body">
                                        What to green-light, what to verify manually, and where beginners should start
                                    </p>
                                </div>
                            </div>
                            {safetyOpen ? (
                                <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                            )}
                        </button>

                        {safetyOpen && (
                            <div className="p-5 pt-0 space-y-5">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="p-4 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 rounded-[var(--radius-md)]">
                                        <div className="flex items-center gap-2 mb-3">
                                            <ShieldCheck className="w-4 h-4 text-[var(--color-secondary)]" />
                                            <p className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Good early use cases
                                            </p>
                                        </div>
                                        <ul className="space-y-2 text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                            {SAFE_TASKS.map((task) => (
                                                <li key={task}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[var(--radius-md)]">
                                        <div className="flex items-center gap-2 mb-3">
                                            <TriangleAlert className="w-4 h-4 text-[var(--color-primary)]" />
                                            <p className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Verify before using
                                            </p>
                                        </div>
                                        <ul className="space-y-2 text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                            {VERIFY_FIRST_TASKS.map((task) => (
                                                <li key={task}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-[var(--radius-md)]">
                                    <p className="font-display font-bold text-sm text-[var(--color-text)] mb-2">
                                        Best first prompts to try
                                    </p>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                        Start with summarization, patient education, de-identified documentation cleanup,
                                        and activity generation. Move into differentials, eligibility, coding, licensure,
                                        payer rules, or device recommendations only after you already have a review process
                                        in place.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden bg-[var(--color-secondary)]/5">
                        <button
                            onClick={() => setCoachOpen((current) => !current)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-secondary)]/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-secondary)] flex items-center justify-center">
                                    <Wand2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-[var(--color-text)] text-lg">Build Your Own Prompt</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body">
                                        5-step scaffold with audience, constraints, and verification language built in
                                    </p>
                                </div>
                            </div>
                            {coachOpen ? (
                                <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                            )}
                        </button>

                        {coachOpen && (
                            <div className="p-5 pt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                                                1
                                            </span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Setting
                                            </span>
                                        </div>
                                        <select
                                            value={coachSetting}
                                            onChange={(event) => setCoachSetting(event.target.value)}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a setting...</option>
                                            {SETTINGS.map((setting) => (
                                                <option key={setting} value={setting}>
                                                    {setting}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                                                2
                                            </span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Specialty
                                            </span>
                                        </div>
                                        <select
                                            value={coachSpecialty}
                                            onChange={(event) => setCoachSpecialty(event.target.value)}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a specialty...</option>
                                            {SPECIALTIES.map((specialty) => (
                                                <option key={specialty} value={specialty}>
                                                    {specialty}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                                                3
                                            </span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Task
                                            </span>
                                        </div>
                                        <select
                                            value={coachTask}
                                            onChange={(event) => setCoachTask(event.target.value)}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a task...</option>
                                            {TASKS.map((task) => (
                                                <option key={task} value={task}>
                                                    {task}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                                                4
                                            </span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Audience
                                            </span>
                                        </div>
                                        <select
                                            value={coachAudience}
                                            onChange={(event) => setCoachAudience(event.target.value)}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select an audience...</option>
                                            {AUDIENCES.map((audience) => (
                                                <option key={audience} value={audience}>
                                                    {audience}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                                                5
                                            </span>
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Format
                                            </span>
                                        </div>
                                        <select
                                            value={coachFormat}
                                            onChange={(event) => setCoachFormat(event.target.value)}
                                            className="w-full px-3 py-2.5 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                                        >
                                            <option value="">Select a format...</option>
                                            {OUTPUT_FORMATS.map((format) => (
                                                <option key={format} value={format}>
                                                    {format}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {generatedPrompt && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-display font-bold text-sm text-[var(--color-text)]">
                                                Your Generated Prompt
                                            </span>
                                            <button
                                                onClick={copyCoachPrompt}
                                                className={`flex items-center gap-1.5 text-sm font-mono font-bold transition-colors ${
                                                    coachCopied
                                                        ? 'text-[var(--color-secondary)]'
                                                        : 'text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]'
                                                }`}
                                            >
                                                {coachCopied ? (
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
                                        <div className="p-4 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)]">
                                            <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-text)] leading-relaxed">
                                                {generatedPrompt}
                                            </pre>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-muted)] font-body leading-relaxed">
                                            Replace the bracketed sections with your own de-identified source material.
                                            If the output touches coding, citations, payer criteria, state rules, or
                                            diagnosis, verify those items manually before use.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
                        <button
                            onClick={() => setTipsOpen((current) => !current)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-text)] flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-[var(--color-text)] text-lg">Prompting Tips for Clinicians</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] font-body">
                                        High-signal habits that make model output safer and more useful
                                    </p>
                                </div>
                            </div>
                            {tipsOpen ? (
                                <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                            )}
                        </button>

                        {tipsOpen && (
                            <div className="p-5 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PROMPTING_TIPS.map((tip, index) => (
                                        <div
                                            key={tip.title}
                                            className="p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)]/30"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <h3 className="font-display font-bold text-sm text-[var(--color-text)] mb-1">
                                                        {tip.title}
                                                    </h3>
                                                    <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed">
                                                        {tip.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div ref={searchRef} className="mb-12 space-y-6">
                    <div className="relative w-full max-w-4xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            aria-label="Search prompts"
                            placeholder="Search the full prompt library (title, tags, and full prompt text)..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full pl-12 pr-10 py-3 bg-[var(--color-surface)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] font-body text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const isActive = activeCategories.includes(category);
                            const count = prompts.filter((prompt) => prompt.category === category).length;

                            return (
                                <button
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    aria-pressed={isActive}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-mono font-bold tracking-wide border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-full)] transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] shadow-[var(--shadow-solid-sm)]'
                                            : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                                    }`}
                                >
                                    {category}
                                    <span
                                        className={`text-xs ${
                                            isActive ? 'opacity-80' : 'text-[var(--color-text-muted)]'
                                        }`}
                                    >
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

                    <p className="font-mono text-sm text-[var(--color-text-muted)]">
                        Showing {filtered.length} of {prompts.length} prompts
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((prompt) => {
                        const isExpanded = expandedId === prompt.id;
                        const isCopied = copiedId === prompt.id;
                        const level = (prompt as { level?: string }).level;
                        const isStarter = BEGINNER_STARTER_IDS.has(prompt.id);
                        const verifyClosely = VERIFY_CLOSELY_IDS.has(prompt.id);

                        return (
                            <div
                                key={prompt.id}
                                className={`card-solid p-6 flex flex-col ${isExpanded ? 'md:col-span-2 xl:col-span-3' : ''}`}
                            >
                                <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className="badge-mono">{prompt.category}</span>
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
                                    {isStarter && (
                                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-[var(--radius-sm)]">
                                            Good first prompt
                                        </span>
                                    )}
                                    {verifyClosely && (
                                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[var(--color-text)]/10 text-[var(--color-text)] border border-[var(--color-border)] rounded-[var(--radius-sm)]">
                                            Verify closely
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-display font-bold text-[var(--color-text)] tracking-tight mb-2">
                                    {prompt.title}
                                </h3>

                                <p className="text-[var(--color-text-muted)] font-body text-sm leading-relaxed mb-4 flex-grow">
                                    {prompt.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {prompt.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-[var(--radius-sm)]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {isExpanded && (
                                    <div className="mb-4 space-y-3">
                                        <div className="p-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[var(--radius-sm)] flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                                            <p className="text-xs text-[var(--color-text-muted)] font-body">
                                                Use de-identified, minimum-necessary information and review every clinical
                                                statement before using it anywhere real.
                                            </p>
                                        </div>

                                        {verifyClosely && (
                                            <div className="p-3 bg-[var(--color-text)]/5 border border-[var(--color-border)]/40 rounded-[var(--radius-sm)] flex items-center gap-2">
                                                <TriangleAlert className="w-4 h-4 text-[var(--color-text)] shrink-0" />
                                                <p className="text-xs text-[var(--color-text-muted)] font-body">
                                                    This template is better for drafting and comparison than final clinical
                                                    decisions. Verify diagnoses, coding, citations, payer rules, device
                                                    recommendations, and state-specific requirements manually.
                                                </p>
                                            </div>
                                        )}

                                        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-x-auto">
                                            <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-text)] leading-relaxed">
                                                {prompt.prompt}
                                            </pre>
                                        </div>
                                    </div>
                                )}

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

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl font-display font-bold text-[var(--color-text)] mb-2">No prompts found</p>
                        <p className="text-[var(--color-text-muted)] font-body">
                            Try adjusting your search or clearing the category filters.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

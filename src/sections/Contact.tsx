import { useEffect, useRef, useState } from 'react';
import { createReveal } from '../utils/animations';
import { Mail, CheckCircle2, Send, ArrowRight } from 'lucide-react';

export default function Contact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (containerRef.current) createReveal(containerRef.current, 'up', 0.2);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('submitting');

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch('https://formsubmit.co/ajax/kristine@thetechslp.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    _subject: `New inquiry from ${formData.get('name')} — The Tech SLP`,
                    _template: 'table',
                }),
            });

            if (response.ok) {
                setFormStatus('success');
                form.reset();
            } else {
                setFormStatus('error');
            }
        } catch {
            setFormStatus('error');
        }
    };

    return (
        <section id="contact" className="section-padding bg-[var(--color-bg)] relative overflow-hidden">
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
            <div className="container-wide max-w-5xl relative z-10">

                <div ref={containerRef} className="card-solid p-8 md:p-16 lg:p-24 relative overflow-hidden text-center md:text-left">

                    {/* Decorative background circle */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 items-center">

                        {/* CTA Copy */}
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text)] tracking-tight leading-[1.1]">
                                LET'S BUILD SOMETHING BETTER.
                            </h2>
                            <p className="text-lg text-[var(--color-text-muted)] font-body leading-relaxed max-w-[450px] mx-auto md:mx-0">
                                Ready to replace outdated tools with software that actually works for clinicians? Whether it's a full application build, UX audit, or technical consulting — let's talk.
                            </p>

                            <div className="pt-4 flex flex-col gap-5 items-center md:items-start">
                                <a href="mailto:kristine@thetechslp.com" className="inline-flex items-center gap-3 text-[var(--color-text)] font-display font-medium text-lg hover:text-[var(--color-primary)] transition-colors group">
                                    <div className="w-12 h-12 rounded-full border-[length:var(--border-width-base)] border-[var(--color-border)] flex items-center justify-center bg-[var(--color-surface)] group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] transition-all">
                                        <Mail className="w-5 h-5 group-hover:text-white transition-colors" />
                                    </div>
                                    kristine@thetechslp.com
                                </a>
                                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] font-mono">
                                    <ArrowRight className="w-4 h-4" />
                                    <span>Typically responds within 24 hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form — FormSubmit.co */}
                        <div className="bg-[var(--color-surface)] p-8 border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-lg)]" style={{ boxShadow: 'var(--shadow-solid-sm)' }}>
                            {formStatus === 'success' ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-[var(--color-text)]">Message Sent</h3>
                                    <p className="text-[var(--color-text-muted)] font-body">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                                    <button
                                        onClick={() => setFormStatus('idle')}
                                        className="mt-4 text-sm font-mono font-bold text-[var(--color-primary)] hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Honeypot for spam */}
                                    <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-mono font-bold text-[var(--color-text)] uppercase tracking-wide">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-body text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-mono font-bold text-[var(--color-text)] uppercase tracking-wide">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-3 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-body text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="block text-sm font-mono font-bold text-[var(--color-text)] uppercase tracking-wide">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            required
                                            placeholder="Tell me about your project..."
                                            className="w-full px-4 py-3 bg-[var(--color-bg)] border-[length:var(--border-width-base)] border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-body text-[var(--color-text)] resize-y placeholder:text-[var(--color-text-muted)]/50"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                    >
                                        {formStatus === 'submitting' ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>

                                    {formStatus === 'error' && (
                                        <div className="p-4 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-[var(--radius-md)]">
                                            <p className="text-[var(--color-primary)] font-body text-sm font-medium">
                                                Something went wrong. You can email me directly at{' '}
                                                <a href="mailto:kristine@thetechslp.com" className="underline font-bold">
                                                    kristine@thetechslp.com
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

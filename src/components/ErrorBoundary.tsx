import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
                    <div className="card-solid p-12 text-center w-full max-w-[32rem]">
                        <p className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-primary)] mb-4">
                            Something went wrong
                        </p>
                        <h1 className="text-3xl font-display font-bold text-[var(--color-text)] tracking-tight mb-4">
                            Unexpected Error
                        </h1>
                        <p className="text-[var(--color-text-muted)] font-body leading-relaxed mb-8">
                            The application encountered an error. Please try reloading the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

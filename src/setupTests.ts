import '@testing-library/jest-dom';
import { vi } from 'vitest';
import './index.css';

// Polyfill window.matchMedia for components that use media queries or
// dark-mode detection (GSAP ScrollTrigger, responsive hooks, etc.)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Polyfill IntersectionObserver for scroll-triggered animations
class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    disconnect = vi.fn();
    observe = vi.fn();
    takeRecords = vi.fn().mockReturnValue([]);
    unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
});

// Suppress GSAP registration warnings in test output
vi.mock('gsap', async () => {
    const actual = await vi.importActual<typeof import('gsap')>('gsap');
    return {
        ...actual,
        default: {
            ...actual.default,
            registerPlugin: vi.fn(),
        },
    };
});

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ANIMATION_CONFIG = {
    ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
    duration: 0.8,
    stagger: 0.08,
    revealDistance: 40,
    scrubSmooth: 1.5, // Heavy physical scroll feel
} as const;

export function createReveal(
    element: Element,
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    delay = 0,
) {
    let y = 0;
    let x = 0;

    if (direction === 'up') y = ANIMATION_CONFIG.revealDistance;
    if (direction === 'down') y = -ANIMATION_CONFIG.revealDistance;
    if (direction === 'left') x = ANIMATION_CONFIG.revealDistance;
    if (direction === 'right') x = -ANIMATION_CONFIG.revealDistance;

    gsap.fromTo(
        element,
        {
            y,
            x,
            opacity: 0,
        },
        {
            y: 0,
            x: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.duration,
            ease: ANIMATION_CONFIG.ease,
            delay,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
        }
    );
}

export function createTextReveal(element: Element, delay = 0) {
    gsap.fromTo(
        element,
        {
            y: 100,
            opacity: 0,
            rotateZ: 2,
        },
        {
            y: 0,
            opacity: 1,
            rotateZ: 0,
            duration: ANIMATION_CONFIG.duration * 1.2,
            ease: ANIMATION_CONFIG.ease,
            delay,
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
            },
        }
    );
}

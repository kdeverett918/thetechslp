import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Root Component', () => {
    it('renders the core structural components', () => {
        // Due to the GSAP animations acting on refs during mount, testing Library might throw act() warnings.
        // For a simple smoke test, we'll verify it mounts without crashing.
        render(<App />);

        // Verify Navigation/Footer mounts (via distinct logo text)
        expect(screen.getAllByText('Tech').length).toBeGreaterThan(0);

        // Verify Hero mounts
        expect(screen.getByText('CLINICAL DEPTH.')).toBeInTheDocument();

        // Verify Footer mounts
        expect(screen.getByText(/DESIGNED AND BUILT IN SEATTLE/i)).toBeInTheDocument();
    });
});

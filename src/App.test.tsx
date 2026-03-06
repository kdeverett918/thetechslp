import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';

describe('App Root Component', () => {
    it('renders the core structural components', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText('CLINICAL DEPTH.')).toBeInTheDocument();
        expect(screen.getAllByText(/the tech/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Prompt Library/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/LET'S BUILD SOMETHING BETTER\./i)).toBeInTheDocument();
    });
});

import { describe, expect, it } from 'vitest';
import { buildSearchQuery, matchesSearchQuery } from './promptSearch';

describe('prompt search matching', () => {
    it('matches hyphen and space variants consistently', () => {
        const text = 'Use a self-cueing hierarchy and write a SOAP note.';

        expect(matchesSearchQuery(buildSearchQuery('self cueing'), text)).toBe(true);
        expect(matchesSearchQuery(buildSearchQuery('self-cueing'), text)).toBe(true);
        expect(matchesSearchQuery(buildSearchQuery('soap-note'), text)).toBe(true);
    });

    it('matches across newline variants', () => {
        const text = 'Generate speech\nsample analysis with a clear rubric.';

        expect(matchesSearchQuery(buildSearchQuery('speech sample'), text)).toBe(true);
        expect(matchesSearchQuery(buildSearchQuery('speech\nsample'), text)).toBe(true);
    });

    it('handles punctuation-heavy short tokens without broad false positives', () => {
        const voiceText = 'Include s/z ratio interpretation and SSI-4 severity rating.';
        const unrelatedText = 'Use ratio guidance with 4 practical examples.';

        expect(matchesSearchQuery(buildSearchQuery('s/z ratio'), voiceText)).toBe(true);
        expect(matchesSearchQuery(buildSearchQuery('s z ratio'), voiceText)).toBe(true);
        expect(matchesSearchQuery(buildSearchQuery('s z ratio'), unrelatedText)).toBe(false);
        expect(matchesSearchQuery(buildSearchQuery('ssi 4'), voiceText)).toBe(true);
        expect(matchesSearchQuery(buildSearchQuery('ssi 4'), unrelatedText)).toBe(false);
    });

    it('matches bracketed tokens from prompt text', () => {
        const text = 'Replace names with [PATIENT] and dates with [DATE].';

        expect(matchesSearchQuery(buildSearchQuery('[patient]'), text)).toBe(true);
    });
});

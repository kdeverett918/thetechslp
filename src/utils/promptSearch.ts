const DASH_PATTERN = /[\u2010-\u2015]/g;
const DIACRITIC_PATTERN = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_PATTERN = /[^a-z0-9]+/g;
const WHITESPACE_PATTERN = /\s+/g;

const normalizeBaseText = (value: string) =>
    value
        .normalize('NFD')
        .replace(DIACRITIC_PATTERN, '')
        .toLowerCase()
        .replace(DASH_PATTERN, '-');

export const canonicalizeSearchText = (value: string) =>
    normalizeBaseText(value)
        .replace(NON_ALPHANUMERIC_PATTERN, ' ')
        .replace(WHITESPACE_PATTERN, ' ')
        .trim();

export interface SearchQuery {
    canonical: string;
    compact: string;
    terms: string[];
}

interface SearchIndex {
    canonical: string;
    compact: string;
}

export const buildSearchQuery = (query: string): SearchQuery => {
    const canonical = canonicalizeSearchText(query);
    return {
        canonical,
        compact: canonical.replace(WHITESPACE_PATTERN, ''),
        terms: canonical ? canonical.split(' ') : [],
    };
};

const buildSearchIndex = (value: string): SearchIndex => {
    const canonical = canonicalizeSearchText(value);
    return {
        canonical,
        compact: canonical.replace(WHITESPACE_PATTERN, ''),
    };
};

const requiresPhraseMatch = (terms: string[]) =>
    terms.length > 1 && terms.some(term => term.length <= 1);

export const matchesSearchQuery = (query: SearchQuery, searchableText: string) => {
    if (query.terms.length === 0) {
        return true;
    }

    const searchable = buildSearchIndex(searchableText);
    const matchesCanonicalPhrase = searchable.canonical.includes(query.canonical);
    const matchesCompactPhrase =
        query.compact.length > 0 && searchable.compact.includes(query.compact);

    if (requiresPhraseMatch(query.terms)) {
        return matchesCanonicalPhrase || matchesCompactPhrase;
    }

    const matchesAllTerms = query.terms.every(
        term =>
            searchable.canonical.includes(term) ||
            searchable.compact.includes(term)
    );

    return matchesCanonicalPhrase || matchesCompactPhrase || matchesAllTerms;
};

import { describe, it, expect } from 'vitest';
import { LinkResolver } from './LinkResolver';

describe('LinkResolver', () => {

    describe('GetRelativeOrAbsolutePath()', () => {

        it('Should keep non-matching origin', async () => {
            const testee = new LinkResolver('https://hakuneko');
            expect(testee.GetRelativeOrAbsolutePath('https://manga.web/chapter?id=123')).toBe('https://manga.web/chapter?id=123');
        });

        it('Should remove matching origin', async () => {
            const testee = new LinkResolver('https://hakuneko', 'https://manga.web');
            expect(testee.GetRelativeOrAbsolutePath('https://manga.web/chapter?id=123')).toBe('/chapter?id=123');
        });
    });

    describe('GetAbsolutePath()', () => {

        it('Should keep absolute url', async () => {
            const testee = new LinkResolver('https://hakuneko');
            expect(testee.GetAbsolutePath('https://manga.web/chapter?id=123', 'https://anime.web')).toBe('https://manga.web/chapter?id=123');
        });

        it('Should prepend missing protocol', async () => {
            const testee = new LinkResolver('https://hakuneko');
            expect(testee.GetAbsolutePath('//manga.web/chapter?id=123', 'https://anime.web')).toBe('https://manga.web/chapter?id=123');
        });

        it('Should prepend missing origin', async () => {
            const testee = new LinkResolver('https://hakuneko');
            expect(testee.GetAbsolutePath('/chapter?id=123', 'https://manga.web')).toBe('https://manga.web/chapter?id=123');
        });

        it('Should replace matching origin', async () => {
            const testee = new LinkResolver('https://hakuneko');
            expect(testee.GetAbsolutePath('https://hakuneko/chapter?id=123', 'https://manga.web')).toBe('https://manga.web/chapter?id=123');
        });
    });
});
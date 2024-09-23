import { describe, it, expect } from 'vitest';
import { MediaChecksum } from './MediaPlugin';

describe('MediaChecksum', () => {

    describe('Constructor', () => {

        it('Should have expected hashes when created without parent', () => {
            const testee = new MediaChecksum(null, 'id', 'title');
            expect(testee.Identifier).toBe('/3hm6g');
            expect(testee.Title).toBe('/2qj8kl');
        });

        it('Should have expected hashes when created with parent', () => {
            const testee = new MediaChecksum(new MediaChecksum(null, 'p-id', 'p-title'), 'c-id', 'c-title');
            expect(testee.Identifier).toBe('/yirvp1/yirvom');
            expect(testee.Title).toBe('/1wec2hk/1wec2h7');
        });
    });

    describe('Match', () => {

        it('Should match when identifier hash is equal', () => {
            const testee = new MediaChecksum(null, 'id', 'title');
            const actual = testee.Match(new MediaChecksum(null, 'id', '-'));
            expect(actual).toBe(true);
        });

        it('Should match when title hash is equal', () => {
            const testee = new MediaChecksum(null, 'id', 'title');
            const actual = testee.Match(new MediaChecksum(null, '-', 'title'));
            expect(actual).toBe(true);
        });

        it('Should not match when neither identifier nor title hash is equal', () => {
            const testee = new MediaChecksum(null, 'id', 'title');
            const actual = testee.Match(new MediaChecksum(null, '-', '-'));
            expect(actual).toBe(false);
        });
    });
});
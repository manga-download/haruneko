import { describe, it, expect } from 'vitest';
import { MediaChecksum } from './MediaPlugin';

describe('MediaChecksum', () => {

    describe('Constructor', () => {

        it('Should have expected hashes when created without parent', () => {
            const testee = new MediaChecksum(null, 'id', 'title');
            expect(testee.Identifier).toBe('/3hmi01yxmg9j');
            expect(testee.Title).toBe('/3133ad1wlyfga');
        });

        it('Should have expected hashes when created with parent', () => {
            const testee = new MediaChecksum(new MediaChecksum(null, 'p-id', 'p-title'), 'c-id', 'c-title');
            expect(testee.Identifier).toBe('/yj8myd10ijc96/yiypqe10it9h5');
            expect(testee.Title).toBe('/c73f6gbw28hz/lrammj2bv11w');
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
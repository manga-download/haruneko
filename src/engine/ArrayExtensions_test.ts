import { describe, it, expect } from 'vitest';
import { MediaContainer, type MediaItem } from './providers/MediaPlugin';
import './ArrayExtensions';

class MediaContainerMock extends MediaContainer<MediaItem> {
    protected PerformUpdate(): Promise<MediaItem[]> {
        return Promise.resolve([]);
    }
}

describe('ArrayExtensions<T>', () => {

    describe('none()', () => {

        it('Should return true when array is empty', async () => {
            const actual = [].none(_ => true);
            expect(actual).toBe(true);
        });

        it('Should return true when predicate does not satisfy any element', async () => {
            const actual = [ 1, 2, 3, 4, 5 ].none(n => n < 0);
            expect(actual).toBe(true);
        });

        it('Should return false when predicate does satisfy at least one element', async () => {
            const actual = [ 1, 2, 3, 4, 5 ].none(n => n % 2 === 0);
            expect(actual).toBe(false);
        });
    });

    describe('count()', () => {

        it('Should return 0 when array is empty', async () => {
            const actual = [].count(_ => true);
            expect(actual).toBe(0);
        });

        it('Should return 0 when predicate does not satisfy any element', async () => {
            const actual = [ 1, 2, 3, 4, 5 ].count(n => n < 0);
            expect(actual).toBe(0);
        });

        it('Should return the number of elements satisfying the predicate', async () => {
            const actual = [ 1, 2, 3, 4, 5 ].count(n => n % 2 !== 0);
            expect(actual).toBe(3);
        });
    });

    describe('distinct()', () => {

        it('Should remove duplicate entries', async () => {
            const actual = [
                new MediaContainerMock('001', 'A'),
                new MediaContainerMock('002', 'B'),
                new MediaContainerMock('001', 'C'),
                new MediaContainerMock('003', 'D'),
                new MediaContainerMock('004', 'E'),
                new MediaContainerMock('004', 'F'),
                new MediaContainerMock('004', 'G'),
                new MediaContainerMock('005', 'H'),
                new MediaContainerMock('003', 'I'),
            ].distinct().map(_ => _.Title);

            expect(actual).toStrictEqual(['A', 'B', 'D', 'E', 'H']);
        });
    });

    describe('isMissingLastItemFrom()', () => {

        it('Should be false when source array and batch array are empty', async () => {
            const actual = [].isMissingLastItemFrom([]);
            expect(actual).toBe(false);
        });

        it('Should be true when source array is empty and batch erray is not empty', async () => {
            const actual = [].isMissingLastItemFrom([ new MediaContainerMock('001', 'A') ]);
            expect(actual).toBe(true);
        });

        it('Should be false when source array is not empty and batch erray is empty', async () => {
            const actual = [ new MediaContainerMock('001', 'A') ].isMissingLastItemFrom([]);
            expect(actual).toBe(false);
        });

        it('Should be true when last item in source array differs from last item in batch array', async () => {
            const actual = [ null, new MediaContainerMock('001', 'A') ].isMissingLastItemFrom([ null, new MediaContainerMock('999', 'X') ]);
            expect(actual).toBe(true);
        });

        it('Should be false when last item in source array is equivalent to last item in batch array', async () => {
            const actual = [ null, new MediaContainerMock('001', 'A') ].isMissingLastItemFrom([ null, new MediaContainerMock('001', 'A') ]);
            expect(actual).toBe(false);
        });
    });

    describe('takeUntil()', () => {

        it.each([
            [ [ 1, 0, 0, 0, 0, 0, 0, 0 ], [ 1 ] ],
            [ [ 1, 2, 0, 0, 0, 0, 0, 0 ], [ 1, 2 ] ],
            [ [ 1, 2, 3, 0, 0, 0, 0, 0 ], [ 1, 2, 3 ] ],
            [ [ 1, 2, 3, 4, 0, 0, 0, 0 ], [ 1, 2, 3, 4 ] ],
            [ [ 1, 2, 3, 4, 5, 0, 0, 0 ], [ 1, 2, 3, 4, 5 ] ],
            [ [ 1, 2, 3, 4, 5, 6, 0, 0 ], [ 1, 2, 3, 4, 5, 6 ] ],
            [ [ 1, 2, 3, 4, 5, 6, 7, 0 ], [ 1, 2, 3, 4, 5, 6, 7 ] ],
            [ [ 1, 2, 3, 4, 5, 6, 7, 8 ], [ 1, 2, 3, 4, 5, 6, 7, 8 ] ],
        ])('Should take items from array based on predicate', async (testee, expected) => {
            const actual = await testee.takeUntil(async item => item > 0);
            expect(actual).toStrictEqual(expected);
        });

        it.each([
            [ [ 1, 2, 3 ] ],
            [ [ 1, 2, 3, 4, 5 ] ],
            [ [ 1, 2, 3, 4, 5, 6 ] ],
            [ [ 1, 2, 3, 4, 5, 6, 7 ] ],
            [ [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ],
        ])('Should throw for invalid array length', async testee => {
            await expect(testee.takeUntil(async () => true)).rejects.toThrow(RangeError);
        });
    });
});
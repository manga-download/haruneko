import { describe, it, expect } from 'vitest';
import { InteractiveFileContentProvider } from './InteractiveFileContentProvider';

describe('InteractiveFileContentProvider', () => {

    describe('IsAbortError', () => {

        it('Should correctly identify abort error', async () => {
            const testee = new InteractiveFileContentProvider();

            const actual = testee.IsAbortError(new DOMException('😈', 'AbortError'));
            expect(actual).toBe(true);
        });

        class AbortError extends Error {
            public override get name() {
                return AbortError.name;
            }
        }

        it.each([
            new DOMException('AbortError', 'Abort'),
            new AbortError('AbortError'),
        ])('Should detect other errors', async (error) => {
            const testee = new InteractiveFileContentProvider();
            expect(testee.IsAbortError(error)).toBe(false);
        });
    });
});
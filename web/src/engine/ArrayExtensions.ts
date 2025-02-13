import type { MediaContainer, MediaChild } from './providers/MediaPlugin';

declare global {
    interface Array<T> extends ArrayExtensions<T> {}
    interface ReadonlyArray<T> extends ArrayExtensions<T> {}
}

type ArrayExtensions<T> = {
    /**
     * Determines whether all the elements of an array dissatisfy the specified {@link predicate}.
     */
    none(predicate: (this: T[], element: T, index: number, array: T[]) => unknown): boolean;

    /**
     * Count the elements of an array satisfying the specified {@link predicate}.
     */
    count(predicate: (this: T[], element: T, index: number, array: T[]) => unknown): number;

    /**
     * Returns the elements of an array where each element's `Identifier` property is unique.
     * When the array contains multiple elements with the same `Identifier`, the first element is choosen.
     */
    distinct<T extends MediaContainer<MediaChild>>(this: T[]): T[];

    /**
     * Check wether the {@link items} array has at least one media item and that media item is different from the last media item in the array.
     */
    isMissingLastItemFrom<T extends MediaContainer<MediaChild>>(this: T[], items: T[]): boolean;

    /**
     * Very specialized extraction for elements in an array matching a very low-performing {@link predicate}.
     * Ideally for determining valid URLs from an automatic generated sequence of links.
     * - The length of the {@link this} array must be a power of two (e.g., 1024)
     * - The elements (at leat one) at the beginning of {@link this} array must fulfill the {@link predicate}, the remaining element(s) must not fulfill the predicate (e.g., true, true, true, false, false)
     */
    takeUntil(this: T[], predicate: (element: T) => Promise<boolean>): Promise<T[]>;
}

if (!Array.prototype.none) {
    Object.defineProperty(Array.prototype, 'none', {
        value: function <T>(this: Array<T>, predicate: (element: T, index: number, array: T[]) => unknown): boolean {
            return !this.some(predicate);
        },
        enumerable: false,
    });
}

if (!Array.prototype.count) {
    Object.defineProperty(Array.prototype, 'count', {
        value: function <T>(this: Array<T>, predicate: (element: T, index: number, array: T[]) => unknown): number {
            return this.filter(predicate).length;
        },
        enumerable: false,
    });
}

if (!Array.prototype.distinct) {
    Object.defineProperty(Array.prototype, 'distinct', {
        value: function <T extends MediaContainer<MediaChild>>(this: Array<T>): Array<T> {
            function isFirstOccurence(entry: T, index: number, array: Array<T>) {
                return index === array.findIndex(item => item.Identifier === entry.Identifier);
            }
            return this.filter(isFirstOccurence);
        },
        enumerable: false,
    });
}

if (!Array.prototype.isMissingLastItemFrom) {
    Object.defineProperty(Array.prototype, 'isMissingLastItemFrom', {
        value: function <T extends MediaContainer<MediaChild>>(this: Array<T>, items: Array<T>): boolean {
            return items.length > 0 && !items.at(-1).IsSameAs(this.at(-1));
        },
        enumerable: false,
    });
}

if (!Array.prototype.takeUntil) {
    async function takeUntil<T>(array: Array<T>, predicate: (element: T) => Promise<boolean>, pivot: number, step: number): Promise<Array<T>> {
        const isPivotValid = await predicate(array.at(pivot));
        if(step < 1) {
            return array.slice(0, pivot + (isPivotValid ? 1 : 0));
        } else {
            return takeUntil(array, predicate, pivot + (isPivotValid ? +step : -step), step >> 1);
        }
    }
    Object.defineProperty(Array.prototype, 'takeUntil', {
        value: function <T>(this: Array<T>, predicate: (element: T) => Promise<boolean>): Promise<Array<T>> {
            if(Math.log2(this.length) % 1 !== 0) {
                return Promise.reject(RangeError());
            }
            return takeUntil(this, predicate, this.length >> 1, this.length >> 2);
        },
        enumerable: false,
    });
}
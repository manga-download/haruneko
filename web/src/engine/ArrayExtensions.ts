import type { MediaContainer, MediaChild } from './providers/MediaPlugin';

declare global {
    interface Array<T> {
        /**
         * Determines whether all the elements of an array dissatisfy the specified {@link predicate}.
         */
        none(predicate: (element: T, index: number, array: T[]) => unknown): boolean;

        /**
         * Count the elements of an array satisfying the specified {@link predicate}.
         */
        count(predicate: (element: T, index: number, array: T[]) => unknown): number;

        /**
         * Returns the elements of an array where each element's `Identifier` property is unique.
         * When the array contains multiple elements with the same `Identifier`, the first element is choosen.
         */
        distinct<T extends MediaContainer<MediaChild>>(this: T[]): T[];

        /**
         * Check wether the {@link items} array has at least one media item and that media item is different from the last media item in the array.
         */
        isMissingLastItemFrom<T extends MediaContainer<MediaChild>>(this: T[], items: T[]): boolean;
    }
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
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';

declare global {
    interface Array<T> {
        /**
         * Returns the first element of an array, or `null` in case the array is empty.
         */
        first(): (T | null);

        /**
         * Returns the last element of an array, or `null` in case the array is empty.
         */
        last(): (T | null);

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

if (!Array.prototype.first) {
    Object.defineProperty(Array.prototype, 'first', {
        value: function <T>(this: Array<T>): T | null {
            return this.length > 0 ? this[0] : null;
        },
        enumerable: false,
    });
}

if (!Array.prototype.last) {
    Object.defineProperty(Array.prototype, 'last', {
        value: function <T>(this: Array<T>): T | null {
            return this.length > 0 ? this[this.length - 1] : null;
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
            return items.length > 0 && !items.last().IsSameAs(this.last());
        },
        enumerable: false,
    });
}
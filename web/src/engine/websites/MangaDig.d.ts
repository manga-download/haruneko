import { type Tag } from '../Tags';
import type { Page } from '../providers/MangaPlugin';
import { type Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
declare type WordArray = {
    words: number[];
    sigBytes: number;
};
export default class extends DecoratableMangaScraper {
    constructor(id?: string, label?: string, url?: string, tags?: Tag[]);
    get Icon(): string;
    FetchPages(chapter: Chapter): Promise<Page[]>;
    convertWordArrayToUint8Array(wordArray: WordArray): ArrayBuffer;
    FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob>;
    decryptPicture(encrypted: Uint8Array, key: ArrayBuffer): Promise<ArrayBuffer>;
}
export {};

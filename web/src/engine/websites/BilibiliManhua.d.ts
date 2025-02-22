import type { Chapter, Manga, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type MangaPlugin } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/TaskPool';
type PageParameters = {
    drm: DRMProvider;
};
declare class DRMProvider {
    private static readonly profiles;
    private static readonly sizeSalt;
    private static readonly keyExchangeAlgorithm;
    private readonly keyExchange;
    /**
     * Get the Base64 encoded raw public key used for boxing the symmetric key
     */
    GetPublicKey(): Promise<string>;
    private GetPrivateKey;
    private DeriveLegacyDecryptionKey;
    private DeriveDecryptionKey;
    /**
     * ...
     * @param contextData - Base64 encoded cipher context data for decryption (containing the initialization-vector or counter-block)
     * @param containerData - Contains the encrypted image data and a secret box with information about the symmetric decryption algorithm and key
     */
    ExtractImageData(contextData: string, containerData: ArrayBuffer): Promise<ArrayBuffer>;
}
export default class extends DecoratableMangaScraper {
    private readonly mangasSequentialTaskPool;
    constructor();
    get Icon(): any;
    ValidateMangaURL(url: string): boolean;
    FetchManga(provider: MangaPlugin, url: string): Promise<Manga>;
    FetchMangas(provider: MangaPlugin): Promise<Manga[]>;
    private GetMangasFromPage;
    FetchChapters(manga: Manga): Promise<Chapter[]>;
    FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]>;
    FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob>;
    private GetImageSizeByQuality;
    private FetchTwirp;
}
export {};

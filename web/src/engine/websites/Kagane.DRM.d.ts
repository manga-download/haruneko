type Page = {
    link: URL;
    parameters: PageParameters;
};
export type PageParameters = {
    MangaID: string;
    ChapterID: string;
    PageNumber: number;
};
export declare class DRMProvider {
    #private;
    constructor();
    CreateImageLinks(chapterURL: URL, mangaIdentifier: string, chapterIdentifier: string): Promise<Page[]>;
    DecryptImage(bytes: ArrayBuffer, parameters: PageParameters): Promise<Blob>;
}
export {};
/**
 * A seeded pseudo number generator (seems to be custom, no library with these methods found yet).
 * Extracted from website script (`class ee`).
 */
/**
 * Extracted from website script (`class et`).
 */
/**
 * Extracted from website script
 * @param e - Scrambled Data
 * @param t - Scramble Mappings
 * @param r - Unknown Flag
 * @returns
 */

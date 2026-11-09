type ChapterList = {
    id: string;
    title: string;
}[];
type ImageLinks = {
    /**
     * A set of responsive images for a single page (ordered by quality ➔ resolution + type)
     */
    srcset: string[];
}[];
export declare class DRMProvider {
    #private;
    CreateChapterList(mangaURL: URL): Promise<ChapterList>;
    CreateImageLinks(chapterURL: URL): Promise<ImageLinks | void>;
}
export {};

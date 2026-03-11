type ChapterList = {
    id: string;
    title: string;
}[];
export declare class DRMProvider {
    Initialize(websiteURL: URL): Promise<void>;
    CreateChapterList(mangaURL: URL): Promise<ChapterList>;
    CreateImageLinks(chapterURL: URL): Promise<string[]>;
}
export {};

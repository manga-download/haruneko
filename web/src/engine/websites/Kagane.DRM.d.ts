type Page = {
    link: URL;
    parameters: PageParameters;
};
export type PageParameters = {
    MangaID: string;
    ChapterID: string;
    PageNumber: number;
    ImageFormat: string;
};
export declare class DRMProvider {
    #private;
    constructor();
    CreateImageLinks(chapterURL: URL, mangaIdentifier: string, chapterIdentifier: string): Promise<Page[]>;
}
export {};

export type PageParameters = {
    MangaID: string;
    ChapterID: string;
    PageNumber: number;
};

type Page = {
    link: URL;
    parameters: PageParameters;
};

export declare class DRMProvider {
    #private;
    constructor();
    CreateImageURL(tokenEndpointUrl: string, bookId: string, assetId: string): Promise<Page[]>;
    DecryptImage(bytes: ArrayBuffer, mimeType?: string): Promise<Blob>;
}

export {};
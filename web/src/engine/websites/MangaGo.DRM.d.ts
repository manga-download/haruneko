type ChapterList = {
    id: string;
    title: string;
}[];
export declare class DRMProvider {
    #private;
    CreateChapterList(websiteURL: URL, mangaURL: URL): Promise<ChapterList>;
    CreatePageLinks(chapterURL: URL): Promise<string[]>;
    CreateImageLink(link: URL): Promise<string>;
    DescrambleImage(link: string, image: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D): Promise<void>;
}
export {};

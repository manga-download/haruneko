export declare class DRMProvider {
    GetChaptersToken(mangaURL: URL): Promise<string>;
    GetPagesToken(chapterURL: URL, chapterId: string): Promise<string>;
}

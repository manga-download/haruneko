type APIChapter = {
    id: number;
    number: number;
    name: string;
    group: {
        name: string;
    } | null;
    pages: {
        baseUrl: string;
        items: {
            url: string;
        }[];
    };
};
export declare class DRMProvider {
    GetChaptersData(mangaURL: URL): Promise<APIChapter[]>;
    CreatePageLinks(chapterURL: URL): Promise<string[]>;
}
export {};

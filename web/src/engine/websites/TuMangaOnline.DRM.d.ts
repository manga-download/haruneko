type ImageLinks = {
    links: string[];
    viewerUrl: string;
};
export declare class DRMProvider {
    CreateImageLinks(chapterUrl: URL): Promise<ImageLinks>;
}
export {};

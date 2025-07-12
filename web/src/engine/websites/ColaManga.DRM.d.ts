type ImageLinks = {
    url: string;
    key?: string;
}[];
export declare class DRMProvider {
    CreateImageLinks(chapterURL: URL): Promise<ImageLinks>;
    DecryptImage(encrypted: ArrayBuffer, keyData: string): Promise<ArrayBuffer>;
}
export {};

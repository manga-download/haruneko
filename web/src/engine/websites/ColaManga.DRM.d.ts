type ImageLinks = {
    url: string;
    keyData?: string;
}[];
export declare class DRMProvider {
    CreateImageLinks(chapterURL: URL): Promise<ImageLinks>;
    DecryptImage(encrypted: ArrayBuffer, keyData: string): Promise<ArrayBuffer>;
}
export {};

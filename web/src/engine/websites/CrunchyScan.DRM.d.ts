type ImageLinks = {
    url: string;
    referer: string;
}[];
export declare class DRMProvider {
    /**
     * Reverse WebAssembly to get the decrypted image links
     * @see https://crunchyscan.fr/crunchyscan_decrypter.wasm?2
     * @see https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
     */
    CreateImageLinks(chapterURL: URL): Promise<ImageLinks>;
    GetImageData(imageURL: URL, referer: string, signal: AbortSignal): Promise<Blob>;
}
export {};

export declare class DRMProvider {
    #private;
    GetPublicKey(): Promise<string>;
    CreateImageLinks(origin: string, extension: string, images: {
        x: number;
        path: string;
    }[]): string;
    ExtractImageData(pageUrl: string, pageIndex: number, chapterUrl: string): Promise<Uint8Array>;
    FetchTwirp<T extends JSONObject>(uri: URL, path: string, payload: JSONObject, payloadWithFingerprint?: boolean): Promise<T>;
}

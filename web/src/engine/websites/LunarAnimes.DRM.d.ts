export declare class DRMProvider {
    #private;
    private readonly uri;
    private readonly api;
    constructor(uri: URL, api: URL);
    Initialize(): Promise<void>;
    FetchSigned<T extends JSONElement>(endpoint: string): Promise<T>;
    private RefreshToken;
    CreateImageLinks(chapterURL: URL): Promise<string[]>;
}

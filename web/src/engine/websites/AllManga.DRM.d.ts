type APIPages = {
    chapterPages: {
        edges: [
            {
                pictureUrlHead: string;
                pictureUrls: {
                    url: string;
                }[];
            }
        ];
    };
};
export declare class DRMProvider {
    CreatePageLinks(chapterURL: URL): Promise<APIPages>;
}
export {};

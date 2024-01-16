export declare enum FetchRedirection {
    None = 0,
    Automatic = 1,
    Interactive = 2
}
declare type AntiScrapingDetection = (dom: Document) => Promise<FetchRedirection | undefined>;
export declare function AddAntiScrapingDetection(detection: AntiScrapingDetection): void;
export declare function GetAntiScrapingDetections(): AntiScrapingDetection[];
export {};

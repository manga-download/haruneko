type JSONElement = null | boolean | number | string | Array<JSONElement> | {
    [key: string]: JSONElement;
};
type AntiScrapingDetection = (invoke: <T extends void | JSONElement = void>(script: string) => T | Promise<T>) => Promise<FetchRedirection | undefined>;
export declare enum FetchRedirection {
    None = 0,
    Automatic = 1,
    Interactive = 2
}
export declare function AddAntiScrapingDetection(detection: AntiScrapingDetection): void;
export declare function GetAntiScrapingDetections(): AntiScrapingDetection[];
export {};

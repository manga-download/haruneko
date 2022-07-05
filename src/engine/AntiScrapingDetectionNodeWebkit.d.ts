/// <reference types="nw.js" />
export declare enum FetchRedirection {
    None = 0,
    Automatic = 1,
    Interactive = 2
}
declare type AntiScrapingDetection = (nwWindow: NWJS_Helpers.win) => Promise<FetchRedirection | undefined>;
export declare function AddAntiScrapingDetection(detection: AntiScrapingDetection): Promise<void>;
export declare function CheckAntiScrapingDetection(nwWindow: NWJS_Helpers.win): Promise<FetchRedirection>;
export declare function PreventDialogs(nwWindow: NWJS_Helpers.win, frame: Window): void;
export {};

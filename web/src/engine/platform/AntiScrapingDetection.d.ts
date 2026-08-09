type Detection = (invoke: <T extends void | JSONElement = void>(script: string) => T | Promise<T>) => Promise<FetchRedirection | undefined>;
interface IRemoteBrowserWindow {
    ExecuteScript: <T extends void | JSONElement = void>(script: string) => T | Promise<T>;
}
export declare enum FetchRedirection {
    None = 0,
    Automatic = 1,
    Interactive = 2
}
export declare function AddAntiScrapingDetection(detect: Detection, pattern?: RegExp): void;
export declare function CheckAntiScrapingDetection(win: IRemoteBrowserWindow, url: string): Promise<FetchRedirection>;
export {};

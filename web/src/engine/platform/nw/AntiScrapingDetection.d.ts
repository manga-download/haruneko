/// <reference types="nw.js" />
import type { FetchRedirection } from '../AntiScrapingDetection';
export declare function CheckAntiScrapingDetection(nwWindow: NWJS_Helpers.win): Promise<FetchRedirection>;
export declare function PreventDialogs(nwWindow: NWJS_Helpers.win, frame: Window): void;

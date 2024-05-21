import type { FetchRedirection } from '../AntiScrapingDetection';
export declare function CheckAntiScrapingDetection(render: () => Promise<Document>): Promise<FetchRedirection>;

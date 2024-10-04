type KeyedCookie<T = chrome.cookies.Cookie> = { [K in keyof T]: KeyedCookie<T[K]> };

export interface Contract {
    SetCloudFlareBypass(userAgent: string, cookies: KeyedCookie[]): Promise<void>;
    LoadMediaContainerFromURL(url: string): Promise<void>;
}
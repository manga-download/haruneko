type Cookie = Omit<chrome.cookies.Cookie, never>;

export interface Contract {
    SetCloudFlareBypass(userAgent: string, cookies: Cookie[]): Promise<void>;
    LoadMediaContainerFromURL(url: string): Promise<void>;
}
import type { RemoteContract } from '../../../../node_modules/websocket-rpc/dist/types';

// See => chrome.cookies.Cookie
type TypeFromInterface<T> = {
    [key in keyof T]: T[key];
};

export class Contract implements RemoteContract<Contract> {

    async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        //alert('SetCloudFlareBypass\n\n' + userAgent);
        console.log('SetCloudFlareBypass', '=>', userAgent, cookies);
        /*
        for(const cookie of cookies) {
            await chrome.cookies.set({ ...cookie, url: 'https://test.cloudscraper.ovh/managed' });
        }
        nw.Window.open('https://test.cloudscraper.ovh/managed', {
            'user-agent': userAgent
        } as NWJS_Helpers.WindowOpenOption);
        */
    }

    async LoadMediaContainerFromURL(url: string): Promise<void> {
        //alert('LoadMediaContainerFromURL\n\n' + url);
        console.log('LoadMediaContainerFromURL', '=>', url);
    }
}
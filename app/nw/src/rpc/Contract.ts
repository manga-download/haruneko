import type { RemoteContract } from '../../../../node_modules/websocket-rpc/dist/types';

// See => chrome.cookies.Cookie
type TypeFromInterface<T> = {
    [key in keyof T]: T[key];
};

export class Contract implements RemoteContract<Contract> {

    async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        alert('SetCloudFlareBypass\n\n' + userAgent);
        console.log('SetCloudFlareBypass', '=>', userAgent, cookies);
    }

    async LoadMediaContainerFromURL(url: string): Promise<void> {
        alert('LoadMediaContainerFromURL\n\n' + url);
        console.log('LoadMediaContainerFromURL', '=>', url);
    }
}
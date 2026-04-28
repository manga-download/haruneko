import { FetchProvider, ParseCookiesFromHeader, MergeCookies } from '../FetchProviderCommon';
import type { FeatureFlags } from '../../FeatureFlags';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunicationChannels';

export default class FetchProviderElectron extends FetchProvider {

    #initialized = false;
    private readonly ipc = GetIPC();

    public Initialize(featureFlags: FeatureFlags): void {

        if (this.#initialized) {
            return;
        } else {
            this.#initialized = true;
        }

        super.Initialize(featureFlags);

        if (globalThis.Request !== FetchRequest) {
            // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
            globalThis.Request = FetchRequest;
        }

        // TODO: Monkey patch `globalThis.fetch`?

        this.ipc.Invoke(Channels.FetchProvider.Initialize, fetchApiSupportedPrefix);
    }

    async Fetch(request: Request): Promise<Response> {
        if (request.credentials === 'omit') {
            // TODO: This will not prevent adding session cookies in main process
            request.headers.set(concealedCookieHeaderName, '');
            request.headers.delete('Authorization');
        } else {
            const cookie = MergeCookies(
                // TODO: This may fail for older desktop clients
                await this.ipc.Invoke(Channels.FetchProvider.GetSessionCookies, { url: new URL(request.url).origin, /* partitionKey: {} */ }),
                ParseCookiesFromHeader(request.headers.get(concealedCookieHeaderName) ?? ''));
            request.headers.set(concealedCookieHeaderName, cookie);
            //console.log('Merged Session Cookies:', cookie);
        }
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }
}
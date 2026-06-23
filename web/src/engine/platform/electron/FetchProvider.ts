import { FetchProvider } from '../FetchProviderCommon';
import { FetchConcealedRequest, FetchApiSupportedPrefix } from '../FetchConcealedRequest';
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

        if (globalThis.Request !== FetchConcealedRequest) {
            // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
            globalThis.Request = FetchConcealedRequest;
        }

        this.ipc.Invoke(Channels.FetchProvider.Initialize, FetchApiSupportedPrefix);
    }

    async Fetch(request: Request): Promise<Response> {
        // TODO: Older Electron desktop clients do not support `Channels.FetchProvider.GetSessionCookies`
        try {
            // TODO: When filter by URL partioned cookies may not be found (e.g., cf_clearance)
            const cookies = await this.ipc.Invoke(Channels.FetchProvider.GetSessionCookies, { url: new URL(request.url).origin, /* partitionKey: {} */ });
            return super.FetchConcealed(request, cookies);
        } catch {
            return super.FetchConcealed(request, []);
        }
    }
}
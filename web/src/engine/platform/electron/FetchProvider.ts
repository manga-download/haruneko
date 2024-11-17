import { FetchProvider } from '../FetchProviderCommon';
import type { FeatureFlags } from '../../FeatureFlags';
import type { IPC } from '../InterProcessCommunication';
import { FetchProvider as Channels } from '../../../../../app/src/ipc/Channels';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Referer',
    'Cookie',
    'Origin',
    'Host',
    'Sec-Fetch-Mode',
    'Sec-Fetch-Dest',
];

function ConcealHeaders(init: HeadersInit): Headers {
    const headers = new Headers(init);
    for(const name of fetchApiForbiddenHeaders) {
        if(headers.has(name)) {
            headers.set(fetchApiSupportedPrefix + name, headers.get(name));
            headers.delete(name);
        }
    }
    return headers;
}

class FetchRequest extends Request {
    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if(init?.headers) {
            init.headers = ConcealHeaders(init.headers);
        }
        super(input, init);
    }
}

export default class extends FetchProvider {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>) {
        super();
    }

    public Initialize(featureFlags: FeatureFlags): void {

        super.Initialize(featureFlags);

        // Abuse the global Request type to check if system is already initialized
        if(globalThis.Request === FetchRequest) {
            return;
        }

        // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
        globalThis.Request = FetchRequest;

        this.ipc.Send(Channels.App.Initialize, fetchApiSupportedPrefix);
    }

    async Fetch(request: Request): Promise<Response> {
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }
}
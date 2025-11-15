import type { FetchProvider } from './FetchProviderCommon.js';
import type { FeatureFlags } from '../FeatureFlags.js';
import { FetchProviderPuppeteer } from './FetchProviderPuppeteer.js';

let instance: FetchProvider;

export function SetupFetchProvider(featureFlags: FeatureFlags) {
    instance = new FetchProviderPuppeteer();
    instance.Initialize(featureFlags);
}

/**
 * Cleanup Puppeteer resources on shutdown
 */
export async function CleanupFetchProvider(): Promise<void> {
    if (instance && 'cleanup' in instance) {
        await (instance as FetchProviderPuppeteer).cleanup();
    }
}

/** {@inheritDoc FetchProvider.Fetch} @see {@link FetchProvider.Fetch} */
export const Fetch: typeof instance.Fetch = (request) => instance.Fetch(request);
/** {@inheritDoc FetchProvider.FetchHTML} @see {@link FetchProvider.FetchHTML} */
export const FetchHTML: typeof instance.FetchHTML = (request) => instance.FetchHTML(request);
/** {@inheritDoc FetchProvider.FetchRegex} @see {@link FetchProvider.FetchRegex} */
export const FetchRegex: typeof instance.FetchRegex = (request, regex) => instance.FetchRegex(request, regex);
/** {@inheritDoc FetchProvider.FetchJSON} @see {@link FetchProvider.FetchJSON} */
export const FetchJSON: typeof instance.FetchJSON = (request) => instance.FetchJSON(request);
/** {@inheritDoc FetchProvider.FetchCSS} @see {@link FetchProvider.FetchCSS} */
export const FetchCSS: typeof instance.FetchCSS = (request, query) => instance.FetchCSS(request, query);
/** {@inheritDoc FetchProvider.FetchProto} @see {@link FetchProvider.FetchProto} */
export const FetchProto: typeof instance.FetchProto = (request, schema, messageTypePath) => instance.FetchProto(request, schema, messageTypePath);
/** {@inheritDoc FetchProvider.FetchGraphQL} @see {@link FetchProvider.FetchGraphQL} */
export const FetchGraphQL: typeof instance.FetchGraphQL = (request, operationName, query, variables, extensions) => instance.FetchGraphQL(request, operationName, query, variables, extensions);
/** {@inheritDoc FetchProvider.FetchNextJS} @see {@link FetchProvider.FetchNextJS} */
export const FetchNextJS: typeof instance.FetchNextJS = (request, predicate) => instance.FetchNextJS(request, predicate);
/** {@inheritDoc FetchProvider.FetchWindowScript} @see {@link FetchProvider.FetchWindowScript} */
export const FetchWindowScript: typeof instance.FetchWindowScript = (request, script, delay?, timeout?) => instance.FetchWindowScript(request, script, delay, timeout);
/** {@inheritDoc FetchProvider.FetchWindowPreloadScript} @see {@link FetchProvider.FetchWindowPreloadScript} */
export const FetchWindowPreloadScript: typeof instance.FetchWindowPreloadScript = (request, preload, script, delay = 0, timeout = 60_000) => instance.FetchWindowPreloadScript(request, preload, script, delay, timeout);
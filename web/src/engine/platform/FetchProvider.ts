import type { FetchProvider, ScriptInjection } from './FetchProviderCommon';
import type { FeatureFlags } from '../FeatureFlags';
import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitFetchProvider from './nw/FetchProvider';
import ElectronFetchProvider from './electron/FetchProvider';
import GetIPC from './InterProcessCommunication';

let instance: FetchProvider;

export function SetupFetchProvider(featureFlags: FeatureFlags) {
    instance = new PlatformInstanceActivator<FetchProvider>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitFetchProvider())
        .Configure(Runtime.Electron, () => new ElectronFetchProvider(GetIPC()))
        .Create();
    instance.Initialize(featureFlags);
}

/** {@inheritDoc FetchProvider.Fetch} @see {@link FetchProvider.Fetch} */
export const Fetch = (request: Request) => instance.Fetch(request);
/** {@inheritDoc FetchProvider.FetchHTML} @see {@link FetchProvider.FetchHTML} */
export const FetchHTML = (request: Request) => instance.FetchHTML(request);
/** {@inheritDoc FetchProvider.FetchRegex} @see {@link FetchProvider.FetchRegex} */
export const FetchRegex = (request: Request, regex: RegExp) => instance.FetchRegex(request, regex);
/** {@inheritDoc FetchProvider.FetchJSON} @see {@link FetchProvider.FetchJSON} */
export const FetchJSON = <T extends JSONElement>(request: Request) => instance.FetchJSON<T>(request);
/** {@inheritDoc FetchProvider.FetchCSS} @see {@link FetchProvider.FetchCSS} */
export const FetchCSS = <T extends HTMLElement>(request: Request, query: string) => instance.FetchCSS<T>(request, query);
/** {@inheritDoc FetchProvider.FetchProto} @see {@link FetchProvider.FetchProto} */
export const FetchProto = <T extends JSONElement>(request: Request, schema: string, messageTypePath: string) => instance.FetchProto<T>(request, schema, messageTypePath);
/** {@inheritDoc FetchProvider.FetchGraphQL} @see {@link FetchProvider.FetchGraphQL} */
export const FetchGraphQL = <T extends JSONElement>(request: Request, operationName: string, query: string, variables: JSONObject) => instance.FetchGraphQL<T>(request, operationName, query, variables);
/** {@inheritDoc FetchProvider.FetchWindowScript} @see {@link FetchProvider.FetchWindowScript} */
export const FetchWindowScript = <T extends void | JSONElement>(request: Request, script: ScriptInjection<T>, delay?: number, timeout?: number) => instance.FetchWindowScript<T>(request, script, delay, timeout);
/** {@inheritDoc FetchProvider.FetchWindowPreloadScript} @see {@link FetchProvider.FetchWindowPreloadScript} */
export const FetchWindowPreloadScript = <T extends void | JSONElement>(request: Request, preload: ScriptInjection<void>, script: ScriptInjection<T>, delay = 0, timeout = 60_000) => instance.FetchWindowPreloadScript<T>(request, preload, script, delay, timeout);
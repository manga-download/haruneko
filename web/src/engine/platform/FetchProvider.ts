import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import type { FeatureFlags } from '../FeatureFlags';
import type { FetchProvider } from './FetchProviderCommon';
import NodeWebkitFetchProvider from './nw/FetchProvider';
import ElectronFetchProvider from './electron/FetchProvider';
import GetIPC from './InterProcessCommunication';

export function CreateFetchProvider(featureFlags: FeatureFlags): FetchProvider {
    return new PlatformInstanceActivator<FetchProvider>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitFetchProvider(featureFlags))
        .Configure(Runtime.Electron, () => new ElectronFetchProvider(GetIPC(), featureFlags))
        .Create();
}

export let Fetch: FetchProvider['Fetch'];
export let FetchHTML: FetchProvider['FetchHTML'];
export let FetchJSON: FetchProvider['FetchJSON'];
export let FetchCSS: FetchProvider['FetchCSS'];
export let FetchGraphQL: FetchProvider['FetchGraphQL'];
export let FetchRegex: FetchProvider['FetchRegex'];
export let FetchProto: FetchProvider['FetchProto'];
export let FetchWindowScript: FetchProvider['FetchWindowScript'];
export let FetchWindowPreloadScript: FetchProvider['FetchWindowPreloadScript'];

export function SetupFetchProviderExports(instance: FetchProvider) {
    instance.Initialize();
    Fetch = instance.Fetch.bind(instance);
    FetchHTML = instance.FetchHTML.bind(instance);
    FetchJSON = instance.FetchJSON.bind(instance);
    FetchCSS = instance.FetchCSS.bind(instance);
    FetchGraphQL = instance.FetchGraphQL.bind(instance);
    FetchRegex = instance.FetchRegex.bind(instance);
    FetchProto = instance.FetchProto.bind(instance);
    FetchWindowScript = instance.FetchWindowScript.bind(instance);
    FetchWindowPreloadScript = instance.FetchWindowPreloadScript.bind(instance);
}
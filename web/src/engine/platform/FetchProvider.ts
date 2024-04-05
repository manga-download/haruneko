import { InternalError } from '../Error';
import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import type { FetchProvider } from './FetchProviderCommon';
import NodeWebkitFetchProvider from './nw/FetchProvider';
import ElectronFetchProvider from './electron/FetchProvider';

class HttpResponseError extends InternalError {
    constructor(public readonly response: Response) {
        super(response.statusText);
    }

    public get status() {
        return this.response.status;
    }
}

export type { HttpResponseError };

export function CreateFetchProvider(): FetchProvider {
    return new PlatformInstanceActivator<FetchProvider>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitFetchProvider())
        .Configure(Runtime.Electron, () => new ElectronFetchProvider())
        .Create();
}

export let Fetch: FetchProvider['Fetch'];
export let FetchHTML: FetchProvider['FetchHTML'];
export let FetchJSON: FetchProvider['FetchJSON'];
export let FetchCSS: FetchProvider['FetchCSS'];
export let FetchGraphQL: FetchProvider['FetchGraphQL'];
export let FetchRegex: FetchProvider['FetchRegex'];
export let FetchProto: FetchProvider['FetchProto'];
export let FetchWindowCSS: FetchProvider['FetchWindowCSS'];
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
    FetchWindowCSS = instance.FetchWindowCSS.bind(instance);
    FetchWindowScript = instance.FetchWindowScript.bind(instance);
    FetchWindowPreloadScript = instance.FetchWindowPreloadScript.bind(instance);
}
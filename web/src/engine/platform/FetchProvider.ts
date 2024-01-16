import { InternalError } from '../Error';
import { Runtime } from './PlatformInfo';
import type { JSONObject } from '../../../../node_modules/websocket-rpc/dist/types';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitFetchProvider from './nw/FetchProvider';

export type PreloadAction = (win: typeof window, frame: typeof window) => void;

class HttpResponseError extends InternalError {
    constructor(public readonly response: Response) {
        super(response.statusText);
    }

    public get status() {
        return this.response.status;
    }
}

export type { HttpResponseError };

/*
const fail = function() {
    throw new NotImplementedError();
};
*/

export interface IFetchProvider {

    IsVerboseModeEnabled: boolean;

    Initialize(): void;

    /**
     * ...
     * @param request - ...
     */
    Fetch(request: Request): Promise<Response>;

    /**
     * ...
     * @param request - ...
     */
    FetchHTML(request: Request): Promise<Document>;

    /**
     * ...
     * @param request - ...
     */
    FetchJSON<TResult>(request: Request): Promise<TResult>;

    /**
     * ...
     * @param request - ...
     * @param query - ...
     */
    FetchCSS<T extends HTMLElement>(request: Request, query: string): Promise<T[]>;

    /**
     * Perform a GraphQL request (POST) to a desired endpoint and returns JSON data.
     * @param operationName - The name of the query to be performed
     * @param query - A valid GraphQL query
     * @param variables - A JSONObject containing the variables of the query.
     */
    FetchGraphQL<TResult>(request: Request, operationName: string, query: string, variables: JSONObject): Promise<TResult>;

    /**
     * ...
     * @param request - ...
     * @param regex - ...
     */
    FetchRegex(request: Request, regex: RegExp): Promise<string[]>;

    /**
     * Fetch and decode a protocol buffer message.
     * @param schema - The schema of the protocol buffer including all supported message definitions
     * @param messageTypePath - The name of the package and schema type separated by a `.` which should be used to decode the response
     * @returns The decoded response data
     */
    FetchProto<TResult>(request: Request, schema: string, messageTypePath: string) : Promise<TResult>;

    /**
     * Open the given {@link request} in a new browser window and execute the given {@link query}.
     * @param request - ...
     * @param query - The CSS query that will be performed for the DOM of the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link query} will be executed
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    FetchWindowCSS<T extends HTMLElement>(request: Request, query: string, delay?: number, timeout?: number): Promise<T[]>;

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param script - The JavaScript that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    FetchWindowScript<T>(request: Request, script: string, delay?: number, timeout?: number): Promise<T>;

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param preload - ...
     * @param script - The JavaScript that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    FetchWindowPreloadScript<T>(request: Request, preload: PreloadAction, script: string, delay?: number, timeout?: number): Promise<T>
}

export function CreateFetchProvider(): IFetchProvider {
    return new PlatformInstanceActivator<IFetchProvider>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitFetchProvider())
        .Create();
}

export let Fetch: IFetchProvider['Fetch'];
export let FetchHTML: IFetchProvider['FetchHTML'];
export let FetchJSON: IFetchProvider['FetchJSON'];
export let FetchCSS: IFetchProvider['FetchCSS'];
export let FetchGraphQL: IFetchProvider['FetchGraphQL'];
export let FetchRegex: IFetchProvider['FetchRegex'];
export let FetchProto: IFetchProvider['FetchProto'];
export let FetchWindowCSS: IFetchProvider['FetchWindowCSS'];
export let FetchWindowScript: IFetchProvider['FetchWindowScript'];
export let FetchWindowPreloadScript: IFetchProvider['FetchWindowPreloadScript'];

export function SetupFetchProviderExports(instance: IFetchProvider) {
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
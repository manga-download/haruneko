import { InternalError } from '../Error';
import { PlatformInfo, Runtime } from './PlatformInfo';

export class PlatformInstanceActivator<T> {
    private readonly activators: Record<Runtime, () => T> = {
        [Runtime.Chrome]: () => this.Fail(Runtime.Chrome),
        [Runtime.Deno]: () => this.Fail(Runtime.Deno),
        [Runtime.Electron]: () => this.Fail(Runtime.Electron),
        [Runtime.Gecko]: () => this.Fail(Runtime.Gecko),
        [Runtime.Node]: () => this.Fail(Runtime.Node),
        [Runtime.NodeWebkit]: () => this.Fail(Runtime.NodeWebkit),
        [Runtime.Unknown]: () => this.Fail(Runtime.Unknown),
        [Runtime.WebKit]: () => this.Fail(Runtime.WebKit),
    };

    constructor(private readonly info: PlatformInfo = new PlatformInfo()) {}

    private Fail(runtime: Runtime): T {
        throw new InternalError(`Failed to create an instance of type <T> for platform '${runtime}'!`);
    }

    public Configure(runtime: Runtime, activator: () => T): PlatformInstanceActivator<T> {
        this.activators[runtime] = activator;
        return this;
    }

    public Create(runtime: Runtime = this.info.Runtime): T {
        return this.activators[runtime]();
    }
}
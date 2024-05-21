import type { IPC } from '../InterProcessCommunication';
import { Key as GlobalKey } from '../../SettingsGlobal';
import type { Numeric, Text, Check, SettingsManager } from '../../SettingsManager';
import type { IRemoteProcedureCallManager } from '../RemoteProcedureCallManager';
import { RemoteProcedureCallManager as Channels } from '../../../../../app/src/ipc/Channels';

export default class RemoteProcedureCallManager implements IRemoteProcedureCallManager {

    private readonly rpcEnabled: Check;
    private readonly rpcPort: Numeric;
    private readonly rpcSecret: Text;

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>, settingsManager: SettingsManager) {
        const settings = settingsManager.OpenScope();
        this.rpcEnabled = settings.Get<Check>(GlobalKey.RPCEnabled);
        this.rpcPort = settings.Get<Numeric>(GlobalKey.RPCPort);
        this.rpcSecret = settings.Get<Text>(GlobalKey.RPCSecret);

        const callback = this.Update.bind(this);
        this.rpcEnabled.Subscribe(callback);
        this.rpcPort.Subscribe(callback);
        this.rpcSecret.Subscribe(callback);

        this.Update();
    }

    private async Update(): Promise<void> {
        return this.rpcEnabled.Value ? this.Restart(this.rpcPort.Value, this.rpcSecret.Value) : this.Stop();
    }

    public async Stop(): Promise<void> {
        return this.ipc.Send(Channels.App.Stop);
    }

    public async Restart(port: number, secret: string): Promise<void> {
        return this.ipc.Send(Channels.App.Restart, port, secret);
    }
}
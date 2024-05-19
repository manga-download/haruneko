import path from 'node:path';
import fs from 'node:fs/promises';
import { app, session, type WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { RPCServer } from '../../../nw/src/rpc/Server';
import { Contract } from '../../../nw/src/rpc/Contract';
import type { TypeFromInterface } from '../../../../web/src/engine/platform/nw/InterProcessCommunicationTypes';

type SendMain = 'RemoteProcedureCallServer::LoadMediaContainerFromURL';
export type ListenRender = SendMain;

type ListenMain = 
    'RemoteProcedureCallServer::StopRPC' |
    'RemoteProcedureCallServer::RestartRPC' |
    'RemoteProcedureCallServer::SetCloudFlareBypass';
export type SendRender = ListenMain;

export class RemoteProcedureCallServer {

    public RPC?: RPCServer;

    constructor(private readonly ipc: IPC<SendMain, ListenMain>, private readonly webContents: WebContents) {
        this.RPC = new RPCServer('/hakuneko', new Contract(this));
        this.ipc.Listen('RemoteProcedureCallServer::StopRPC', this.StopRPC.bind(this));
        this.ipc.Listen('RemoteProcedureCallServer::RestartRPC', this.RestartRPC.bind(this));
        this.ipc.Listen('RemoteProcedureCallServer::SetCloudFlareBypass', this.SetCloudFlareBypass.bind(this));
    }

    public async StopRPC() {
        return this.RPC?.Stop();
    }

    public async RestartRPC(port: number, secret: string) {
        return this.RPC?.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }

    public async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        if(userAgent !== this.webContents.getUserAgent()) {
            const file = path.resolve(app.getAppPath(), 'package.json');
            const manifest = JSON.parse(await fs.readFile(file, 'utf-8'));
            manifest['user-agent'] = userAgent;
            await fs.writeFile(file, JSON.stringify(manifest, null, 2), 'utf-8');
            this.webContents.setUserAgent(userAgent);
        }

        for(const cookie of cookies) {
            await session.defaultSession.cookies.set({
                domain: cookie.domain,
                path: cookie.path,
                url: `https://${ cookie.domain.replace(/^\./, '') }${ cookie.path }`,
                name: cookie.name,
                value: cookie.value,
                expirationDate: cookie.expirationDate,
                httpOnly: cookie.httpOnly,
                secure: cookie.secure,
                sameSite: cookie.sameSite,
                //storeId: cookie.storeId,
            });
        }
    }

    public async LoadMediaContainerFromURL(url: string) {
        return this.ipc.Send('RemoteProcedureCallServer::LoadMediaContainerFromURL', url);
    }
}
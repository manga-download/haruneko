import { createServer, type Server, type IncomingMessage } from 'node:http';
import { createHash } from 'node:crypto';
// NOTE: Import with absolute path to integrate this file when bundling with roll-up
import { CreateServer, type WebSocketServer } from '../../../../node_modules/websocket-rpc/dist/server';
import type { Contract } from './Contract';

class AccessDeniedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = AccessDeniedError.name;
    }
}

export class RPCServer {

    private readonly httpd: Server;
    private readonly websocket: Promise<WebSocketServer>;
    private allowedOrigins: RegExp[] = [];
    private token?: string = undefined;

    constructor(endpoint: string, contract: Contract) {
        this.httpd = createServer()
            .on('connect', this.DestroyConnection.bind(this))
            .on('request', this.DestroyConnection.bind(this))
            .on('upgrade', this.Authorize.bind(this));
        this.websocket = CreateServer(contract, {
            server: this.httpd,
            path: endpoint
        });
    }

    private pendingUdpdateRPC?: NodeJS.Timeout | number;

    private QueuePendingUpdateRPC(callback: () => Promise<void>) {
        clearTimeout(this.pendingUdpdateRPC);
        console.log('Timer Cleared:', this.pendingUdpdateRPC);
        this.pendingUdpdateRPC = setTimeout(callback.bind(this), 2500);
        console.log('Timer Queued:', this.pendingUdpdateRPC);
    }

    private Close(): Promise<void> {
        return new Promise<void>(resolve => this.httpd.close(() => resolve()));
        //return new Promise<void>(resolve => this.websocket.close(() => resolve()));
    }

    public Stop(): void {
        console.log('Queue: Stop');
        this.QueuePendingUpdateRPC(this.Close.bind(this));
    }

    public async Listen(port: number, secret: string, allowedOrigins: RegExp[]) {
        console.log('Queue: Listen');
        this.QueuePendingUpdateRPC(async () => {
            this.token = createHash('SHA256').update(secret).digest('hex').toUpperCase();
            this.allowedOrigins = allowedOrigins;
            await this.Close();
            this.httpd.listen(port);
        });
    }

    private DestroyConnection(request: IncomingMessage) {
        request?.socket?.destroy();
    }

    private Authorize(request: IncomingMessage) {
        try {
            if(!this.allowedOrigins.some(pattern => pattern.test(request.headers.origin ?? ''))) {
                throw new AccessDeniedError(`Requests with origin '${request.headers.origin}' are not allowed!`);
            }
            if(!/upgrade/i.test(request.headers.connection ?? '')) {
                throw new AccessDeniedError(`Requests with connection '${request.headers.connection}' are not allowed!`);
            }
            if(!/websocket/i.test(request.headers.upgrade ?? '')) {
                throw new AccessDeniedError(`Request with upgrade '${request.headers.upgrade}' are not allowed!`);
            }
            if(new URL(request.url ?? '', 'http://' + request.headers.host).searchParams.get('token') !== this.token) {
                // TODO: Show forbidden response with helpful error message?
                //request.end(403);
                throw new AccessDeniedError('Requests with missing or invalid token are not allowed!');
            }
            console.log(`RPC Accepted <${request.method}>:`, request.url, request.headers);
        } catch(error) {
            console.warn(`RPC Rejected <${request.method}>:`, request.url, error);
            this.DestroyConnection(request);
        }
    }
}
export type MessageRequest<T extends string> = {
    id: string,
    action: T,
    payload: unknown,
}

export type MessageResponse = {
    id: string,
    success: boolean,
    message: string,
    payload: unknown,
}

// https://v3.vitejs.dev/guide/features.html#web-workers
export abstract class BackgroundWorker {

    constructor() {
        onmessage = this.HandleMessage.bind(this);
    }

    private CreateMesasage(id: string, error: string, payload: unknown): MessageResponse {
        const success = error ? false : true;
        return { id, success, message: error, payload };
    }

    private async HandleMessage(event: MessageEvent<unknown>) {
        console.log('Worker (request):', event.data);
        if(event.data['id'] && event.data['action']) {
            const data = event.data as MessageRequest<string>;
            try {
                postMessage(this.CreateMesasage(data.id, null, await this.ProcessMessage(data)));
            } catch(error) {
                postMessage(this.CreateMesasage(data.id, 'An error occured!', null));
            }
        } else {
            // Ignore Invalid Worker Request?
        }
    }

    protected abstract ProcessMessage(data: MessageRequest<string>): Promise<unknown>;
}
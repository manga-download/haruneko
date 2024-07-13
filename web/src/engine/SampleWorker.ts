/**
 * IMPORTANT:
 * This file must not be imported, except a
 */

/*
* Sample usage of this worker
*
* import { BackgroundWorkerProxy } from './BackgroundWorkerProxy';
* import SampleWorker from './SampleWorker?worker&inline';
* import { SampleWorkerAction, type SampleWorkerProxy } from './SampleWorkerTypes';
*
* const worker: SampleWorkerProxy = new BackgroundWorkerProxy(new SampleWorker());
* console.log('Worker (payload):', await worker.PostMessage(SampleWorkerAction.Multiply, { a: 11, b: 13 }));
* console.log('Worker (payload):', await worker.PostMessage(SampleWorkerAction.Divide, { a: 13, b: 19 }));
*/

import { BackgroundWorker, type MessageRequest } from './BackgroundWorker';
import { SampleWorkerAction } from './SampleWorkerTypes';

// https://v3.vitejs.dev/guide/features.html#web-workers
class SampleWorker extends BackgroundWorker {

    protected override ProcessMessage(data: MessageRequest<SampleWorkerAction>): Promise<unknown> {
        switch (data.action) {
            case SampleWorkerAction.Multiply:
                return this.Multiply(data.payload as { a: number, b: number });
            case SampleWorkerAction.Divide:
                return this.Divide(data.payload as { a: number, b: number });
            default:
                //
        }
    }

    async Multiply(payload: { a: number, b: number }): Promise<number> {
        return payload.a * payload.b;
    }

    async Divide(payload: { a: number, b: number }): Promise<number> {
        return payload.a / payload.b;
    }
}

new SampleWorker();
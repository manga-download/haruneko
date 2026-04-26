import { vi, describe, it, expect } from 'vitest';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunicationChannels';
import BloatGuard from './BloatGuard';

class TestFixture {

    public readonly MockIpcRenderer = {
        invoke: vi.fn(),
    };

    constructor() {
        globalThis.ipcRenderer = this.MockIpcRenderer as unknown as Electron.IpcRenderer;
    }

    public CreatTestee(patterns: string[]): BloatGuard {
        return new BloatGuard(patterns);
    }
}

describe('BloatGuard', () => {

    describe('Initialize', () => {

        it('Should relay invocation to IPC channel', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee(['😎']);
            testee.Initialize();
            expect(fixture.MockIpcRenderer.invoke).toHaveBeenCalledTimes(1);
            expect(fixture.MockIpcRenderer.invoke).toHaveBeenCalledWith(Channels.BloatGuard.Initialize, ['😎']);
        });
    });
});
import { vi, describe, it, expect } from 'vitest';
import type { IPC } from './InterProcessCommunication';
import type { RPCServer } from '../../../src/rpc/Server';
import { RemoteProcedureCallManager } from './RemoteProcedureCallManager';
import { RemoteProcedureCallManager as Channels } from '../../../src/ipc/Channels';

class TestFixture {

    public readonly mockIPC = {
        Listen: vi.fn(),
    } as unknown as IPC<string, string>;

    private readonly mockRPC = <RPCServer>{};

    public CreatTestee(): RemoteProcedureCallManager {
        return new RemoteProcedureCallManager(this.mockRPC, this.mockIPC);
    }
}

describe('RemoteProcedureCallManager', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            expect(testee).toBeDefined();
            expect(fixture.mockIPC.Listen).toHaveBeenCalledTimes(2);
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.Stop, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.Restart, expect.anything());
        });
    });
});
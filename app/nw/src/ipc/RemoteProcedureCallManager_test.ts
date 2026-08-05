import { vi, describe, it, expect } from 'vitest';
import { type IPC, Channels } from './InterProcessCommunication';
import type { RPCServer } from '../../../src/rpc/Server';
import { RemoteProcedureCallManager } from './RemoteProcedureCallManager';

class TestFixture {

    public readonly mockIPC = {
        Handle: vi.fn(),
    } as unknown as IPC;

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
            expect(fixture.mockIPC.Handle).toHaveBeenCalledTimes(2);
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteProcedureCallManager.Stop, expect.anything());
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteProcedureCallManager.Restart, expect.anything());
        });
    });
});
import { vi, describe, it, expect } from 'vitest';
import type { IPC } from './InterProcessCommunication';
import { Channels } from './InterProcessCommunicationChannels';
import { RemoteProcedureCallContract } from './RemoteProcedureCallContract';

class TestFixture {

    public readonly mockIPC = {
        Send: vi.fn(),
    } as unknown as IPC;

    public CreatTestee(): RemoteProcedureCallContract {
        return new RemoteProcedureCallContract(this.mockIPC, null as unknown as Electron.WebContents);
    }
}

describe('RemoteProcedureCallContract', () => {

    describe('Constructor', () => {

        it('Should create instance', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            expect(testee).toBeDefined();
        });
    });

    describe('LoadMediaContainerFromURL', () => {

        it('Should relay invocation to IPC channel', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            testee.LoadMediaContainerFromURL('😎');
            expect(fixture.mockIPC.Send).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Send).toHaveBeenCalledWith(Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, '😎');
        });
    });
});
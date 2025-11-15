import { vi, describe, it, expect } from 'vitest';
import type { IPC } from '../InterProcessCommunication';
import { BloatGuard as Channels } from '../../../../../app/src/ipc/Channels';
import BloatGuard from './BloatGuard';

class TestFixture {

    public readonly mockIPC = {
        Send: vi.fn(),
    } as unknown as IPC<string, string>;

    public CreatTestee(patterns: string[]): BloatGuard {
        return new BloatGuard(this.mockIPC, patterns);
    }
}

describe('BloatGuard', () => {

    describe('Initialize', () => {

        it('Should relay invocation to IPC channel', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee(['😎']);
            testee.Initialize();
            expect(fixture.mockIPC.Send).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Send).toHaveBeenCalledWith(Channels.App.Initialize, ['😎']);
        });
    });
});
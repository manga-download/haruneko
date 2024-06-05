import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { BloatGuard as Channels } from '../../../src/ipc/Channels';
import { BloatGuard } from './BloatGuard';

class TestFixture {

    public readonly mockIPC = {
        Listen: vi.fn(),
    } as unknown as IPC<never, never>;

    private readonly mockWebContents = {
    } as unknown as WebContents;

    public CreatTestee(): BloatGuard {
        return new BloatGuard(this.mockIPC, this.mockWebContents);
    }
}

describe('BloatGuard', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            expect(testee).toBeDefined();
            expect(fixture.mockIPC.Listen).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.Initialize, expect.anything());
        });
    });
});
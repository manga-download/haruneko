import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import { type IPC, Channels } from './InterProcessCommunication';
import { BloatGuard } from './BloatGuard';

class TestFixture {

    public readonly mockIPC = {
        Handle: vi.fn(),
    } as unknown as IPC;

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
            expect(fixture.mockIPC.Handle).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.BloatGuard.Initialize, expect.anything());
        });
    });
});
import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { Channels } from './InterProcessCommunicationChannels';
import { BloatGuard } from './BloatGuard';

class TestFixture {

    public readonly MockIPC = {
        Handle: vi.fn(),
    } as unknown as IPC;

    private readonly MockWebContents = {
    } as unknown as WebContents;

    public CreatTestee(): BloatGuard {
        return new BloatGuard(this.MockIPC, this.MockWebContents);
    }
}

describe('BloatGuard', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            expect(testee).toBeDefined();
            expect(fixture.MockIPC.Handle).toHaveBeenCalledTimes(1);
            expect(fixture.MockIPC.Handle).toHaveBeenCalledWith(Channels.BloatGuard.Initialize, expect.anything());
        });
    });
});
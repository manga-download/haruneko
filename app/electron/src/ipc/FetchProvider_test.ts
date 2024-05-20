import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { FetchProvider, MainChannels } from './FetchProvider';

class TestFixture {

    public readonly mockIPC = {
        Listen: vi.fn(),
    } as unknown as IPC<never, never>;

    private readonly mockWebContents = {
        getURL: vi.fn(),
    } as unknown as WebContents;

    public CreatTestee(url: string): FetchProvider {
        vi.mocked(this.mockWebContents.getURL).mockReturnValue(url);
        return new FetchProvider(this.mockIPC, this.mockWebContents);
    }
}

describe('FetchProvider', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee('http://localhost');
            expect(testee).toBeDefined();
            expect(fixture.mockIPC.Listen).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(MainChannels.Initialize, expect.anything());
        });
    });
});
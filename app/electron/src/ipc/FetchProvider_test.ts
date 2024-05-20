import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import { FetchProvider, MainChannels } from './FetchProvider';
import type { IPC } from './InterProcessCommunication';

class TestFixture {

    public readonly mockIPC = <IPC<never, never>>{
        Listen: vi.fn<[], string>() as IPC<never, never>['Listen'],
    };

    private readonly mockWebContents = <WebContents>{
        getURL: vi.fn<[], string>() as WebContents['getURL'],
    };

    public CreatTestee(url: string): FetchProvider {
        vi.mocked(this.mockWebContents.getURL).mockReturnValue(url);
        return new FetchProvider(this.mockIPC, this.mockWebContents);
    }
}

describe('FetchProvider', () => {

    describe('Constructor', () => {

        it('Should create instance', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee('http://localhost');
            expect(testee).toBeDefined();
            expect(fixture.mockIPC.Listen).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(MainChannels.Initialize, expect.anything());
        });
    });
});
import { vi, describe, it, expect } from 'vitest';
import type { IPC } from './InterProcessCommunication';
import { MainChannels, RemoteBrowserWindowController } from './RemoteBrowserWindow';

class TestFixture {

    public readonly mockIPC = {
        Listen: vi.fn(),
    } as unknown as IPC<string, string>;

    public CreatTestee(): RemoteBrowserWindowController {
        return new RemoteBrowserWindowController(this.mockIPC);
    }
}

describe('RemoteBrowserWindowController', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            expect(testee).toBeDefined();
            expect(fixture.mockIPC.Listen).toHaveBeenCalledTimes(5);
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(MainChannels.OpenWindow, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(MainChannels.CloseWindow, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(MainChannels.SetVisibility, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(MainChannels.ExecuteScript, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(MainChannels.LoadURL, expect.anything());
        });
    });
});
import { vi, describe, it, expect } from 'vitest';
import type { IPC } from './InterProcessCommunication';
import { RemoteBrowserWindowController } from './RemoteBrowserWindow';
import { RemoteBrowserWindowController as Channels } from '../../../src/ipc/Channels';

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
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.OpenWindow, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.CloseWindow, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.SetVisibility, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.ExecuteScript, expect.anything());
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.LoadURL, expect.anything());
        });
    });
});
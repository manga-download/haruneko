import { vi, describe, it, expect } from 'vitest';
import type { IPC } from './InterProcessCommunication';
import { Channels } from './InterProcessCommunicationChannels';
import { RemoteBrowserWindowController } from './RemoteBrowserWindow';

class TestFixture {

    public readonly mockIPC = {
        Handle: vi.fn(),
    } as unknown as IPC;

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
            expect(fixture.mockIPC.Handle).toHaveBeenCalledTimes(6);
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteBrowserWindowController.OpenWindow, expect.anything());
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteBrowserWindowController.CloseWindow, expect.anything());
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteBrowserWindowController.SetVisibility, expect.anything());
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteBrowserWindowController.ExecuteScript, expect.anything());
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteBrowserWindowController.SendDebugCommand, expect.anything());
            expect(fixture.mockIPC.Handle).toHaveBeenCalledWith(Channels.RemoteBrowserWindowController.LoadURL, expect.anything());
        });
    });
});
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ipcMain, type WebContents } from 'electron';
import { IPC } from './InterProcessCommunication';

vi.mock('electron', () => {
    return {
        ipcMain: {
            handle: vi.fn(),
        }
    };
});

class TestFixture {

    public readonly mockWebContents = {
        send: vi.fn(),
    } as unknown as WebContents;

    public CreatTestee(): IPC<string, string> {
        return new IPC<string, string>(this.mockWebContents);
    }
}

describe('IPC', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Constructor', () => {

        it('Should create instance', () => {
            const testee = new IPC<string, string>(null);
            expect(testee).toBeDefined();
        });
    });

    describe('Listen', () => {

        it('Should relay subscription to Electron asynchronouos messaging', () => {
            const testee = new IPC<string, string>(null);
            testee.Listen('😎', async () => {});
            expect(ipcMain.handle).toHaveBeenCalledTimes(1);
            expect(ipcMain.handle).toHaveBeenCalledWith('😎', expect.anything());
        });
    });

    describe('Send', () => {

        it('Should relay invocation to Electron asynchronouos messaging', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            testee.Send('😎', 7);
            expect(fixture.mockWebContents.send).toHaveBeenCalledTimes(1);
            expect(fixture.mockWebContents.send).toHaveBeenCalledWith('😎', 7);
        });
    });
});
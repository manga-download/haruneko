import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ipcMain, type WebContents } from 'electron';
import { IPC } from './InterProcessCommunication';

vi.mock('electron', () => {
    return {
        ipcMain: {
            on: vi.fn(),
            handle: vi.fn(),
        }
    };
});

class TestFixture {

    public readonly MockWebContents = {
        send: vi.fn(),
    };

    public CreatTestee(): IPC {
        return new IPC(this.MockWebContents as unknown as WebContents);
    }
}

describe('IPC', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Constructor', () => {

        it('Should create instance', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            expect(testee).toBeDefined();
        });
    });

    describe('On', () => {

        it('Should relay subscription to Electron asynchronouos messaging', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            const on = testee.On.bind(testee) as unknown as (channel: string, callback: unknown) => void;
            on('😎', async () => { });
            expect(ipcMain.on).toHaveBeenCalledTimes(1);
            expect(ipcMain.on).toHaveBeenCalledWith('😎', expect.anything());
        });
    });

    describe('Send', () => {

        it('Should relay invocation to Electron asynchronouos messaging', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            const send = testee.Send.bind(testee) as (channel: string, ...args: unknown[]) => void;
            send('😎', '✅', 7);
            expect(fixture.MockWebContents.send).toHaveBeenCalledTimes(1);
            expect(fixture.MockWebContents.send).toHaveBeenCalledWith('😎', '✅', 7);
        });
    });

    describe('Handle', () => {

        it('Should relay subscription to Electron asynchronouos messaging', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            const handle = testee.Handle.bind(testee) as (channel: string, callback: unknown) => void;
            handle('😎', async () => { });
            expect(ipcMain.handle).toHaveBeenCalledTimes(1);
            expect(ipcMain.handle).toHaveBeenCalledWith('😎', expect.anything());
        });
    });
});
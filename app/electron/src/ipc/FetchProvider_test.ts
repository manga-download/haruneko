import { vi, describe, it, expect } from 'vitest';
import { ipcMain, type WebContents } from 'electron';
import { FetchProvider } from './FetchProvider';

vi.mock('electron', () => {
    return {
        ipcMain: <Electron.IpcMain>{
            handle: vi.fn() as Electron.IpcMain['handle']
        }
    };
});

describe('FetchProvider', () => {

    describe('Constructor', () => {

        it('Should create instance', () => {
            const testee = new FetchProvider(<WebContents>{});
            expect(testee).toBeDefined();
            expect(ipcMain.handle).toHaveBeenCalledTimes(1);
            expect(ipcMain.handle).toHaveBeenCalledWith('FetchProvider::Initialize', expect.anything());
        });
    });
});
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

class TestFixture {

    private readonly mockWebContents = <WebContents>{
        getURL: vi.fn<[], string>() as WebContents['getURL'],
    };

    public CreatTestee(url: string): FetchProvider {
        vi.mocked(this.mockWebContents.getURL).mockReturnValue(url);
        return new FetchProvider(this.mockWebContents);
    }
}

describe('FetchProvider', () => {

    describe('Constructor', () => {

        it('Should create instance', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee('http://localhost');
            expect(testee).toBeDefined();
            expect(ipcMain.handle).toHaveBeenCalledTimes(1);
            expect(ipcMain.handle).toHaveBeenCalledWith('FetchProvider::Initialize', expect.anything());
        });
    });
});
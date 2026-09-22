import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateRemoteBrowserWindow } from './RemoteBrowserWindow';
import { CheckAntiScrapingDetection, FetchRedirection } from './AntiScrapingDetection';
import { Observable } from '../Observable';
import type { FeatureFlags } from '../FeatureFlags';
import { FetchProvider } from './FetchProviderCommon';

vi.mock('./RemoteBrowserWindow', () => ({
    CreateRemoteBrowserWindow: vi.fn(),
}));

vi.mock('./AntiScrapingDetection', () => ({
    CheckAntiScrapingDetection: vi.fn(),
    FetchRedirection: { None: 0, Automatic: 1, Interactive: 2 },
}));

class TestFetchProvider extends FetchProvider {
    public Fetch(): Promise<Response> {
        throw new Error('Not required for these tests');
    }
}

/**
 * Create a stand-in for an {@link IRemoteBrowserWindow} whose `Open` triggers the `DOMReady` event
 */
function CreateWindowMock(executeScript: () => Promise<unknown>) {
    const domReady = new Observable<void, unknown>(undefined, {});
    const win = {
        DOMReady: domReady,
        BeforeWindowNavigate: new Observable<URL, unknown>(undefined, {}),
        BeforeFrameNavigate: new Observable<URL, unknown>(undefined, {}),
        Open: vi.fn(() => {
            domReady.Dispatch();
            return Promise.resolve();
        }),
        Close: vi.fn(),
        Show: vi.fn(),
        Hide: vi.fn(),
        ExecuteScript: vi.fn(executeScript),
    };
    vi.mocked(CreateRemoteBrowserWindow).mockReturnValue(win as never);
    return win;
}

describe('FetchProvider', () => {

    const testee = new TestFetchProvider();

    beforeEach(() => {
        vi.mocked(CheckAntiScrapingDetection).mockResolvedValue(FetchRedirection.None);
        testee.Initialize({ VerboseFetchWindow: { Value: false } } as FeatureFlags);
    });

    describe('FetchWindowScript', () => {

        it('Should resolve the result of the evaluated script', async () => {
            const win = CreateWindowMock(() => Promise.resolve('meow'));
            const actual = await testee.FetchWindowScript(new Request('https://hakuneko.app/'), 'script', 0, 1_000);
            expect(actual).toBe('meow');
            expect(win.Close).toHaveBeenCalled();
        });

        it('Should reject when the evaluated script throws instead of waiting forever', async () => {
            const win = CreateWindowMock(() => Promise.reject(new Error('Broken script')));
            const promise = testee.FetchWindowScript(new Request('https://hakuneko.app/'), 'script', 0, 1_000);
            await expect(promise).rejects.toThrowError('Broken script');
            expect(win.Close).toHaveBeenCalled();
        });

        it('Should reject when the anti-scraping detection throws instead of waiting forever', async () => {
            vi.mocked(CheckAntiScrapingDetection).mockRejectedValue(new Error('Broken detection'));
            CreateWindowMock(() => Promise.resolve('meow'));
            const promise = testee.FetchWindowScript(new Request('https://hakuneko.app/'), 'script', 0, 1_000);
            await expect(promise).rejects.toThrowError('Broken detection');
        });

        it('Should reject with a timeout when the evaluated script never yields a result', async () => {
            const win = CreateWindowMock(() => new Promise(() => { /* NEVER SETTLED */ }));
            const promise = testee.FetchWindowScript(new Request('https://hakuneko.app/'), 'script', 0, 100);
            await expect(promise).rejects.toThrowError(expect.objectContaining({ name: 'Exception<FetchProvider_FetchWindow_TimeoutError>' }));
            expect(win.Close).toHaveBeenCalled();
        });

        it('Should reject with a timeout when the window never becomes ready', async () => {
            const win = CreateWindowMock(() => Promise.resolve('meow'));
            win.Open.mockImplementation(() => Promise.resolve());
            const promise = testee.FetchWindowScript(new Request('https://hakuneko.app/'), 'script', 0, 100);
            await expect(promise).rejects.toThrowError(expect.objectContaining({ name: 'Exception<FetchProvider_FetchWindow_TimeoutError>' }));
        });
    });
});

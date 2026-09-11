import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Observable } from '../Observable';
import type { FeatureFlags } from '../FeatureFlags';
import type { IRemoteBrowserWindow } from './RemoteBrowserWindow';

const mocks = vi.hoisted(() => ({
    window: undefined as IRemoteBrowserWindow | undefined,
}));

vi.mock('./RemoteBrowserWindow', () => ({
    CreateRemoteBrowserWindow: () => mocks.window,
}));

vi.mock('./AntiScrapingDetection', () => ({
    FetchRedirection: { None: 0, Automatic: 1, Interactive: 2 },
    CheckAntiScrapingDetection: () => Promise.resolve(0),
}));

import { FetchProvider } from './FetchProviderCommon';

class TestFetchProvider extends FetchProvider {
    public override Fetch(request: Request): Promise<Response> {
        return fetch(request);
    }
}

function CreateWindow(options: { openError?: Error, scriptError?: Error } = {}) {
    const domReady = new Observable<void, IRemoteBrowserWindow>(null);
    const window = {
        DOMReady: domReady,
        BeforeWindowNavigate: new Observable<URL, IRemoteBrowserWindow>(null),
        BeforeFrameNavigate: new Observable<URL, IRemoteBrowserWindow>(null),
        Open: vi.fn(async () => {
            if (options.openError) throw options.openError;
            queueMicrotask(() => domReady.Dispatch());
        }),
        Close: vi.fn().mockResolvedValue(undefined),
        Show: vi.fn().mockResolvedValue(undefined),
        Hide: vi.fn().mockResolvedValue(undefined),
        ExecuteScript: vi.fn(async () => {
            if (options.scriptError) throw options.scriptError;
            return 'ok';
        }),
        SendDebugCommand: vi.fn(),
    } as unknown as IRemoteBrowserWindow;
    return window;
}

describe('FetchProvider.FetchWindowPreloadScript', () => {
    let testee: TestFetchProvider;

    beforeEach(() => {
        testee = new TestFetchProvider();
        testee.Initialize({ VerboseFetchWindow: { Value: false } } as FeatureFlags);
    });

    it('rejects when the injected script fails', async () => {
        const error = new Error('script failed');
        mocks.window = CreateWindow({ scriptError: error });

        await expect(testee.FetchWindowPreloadScript(
            new Request('https://example.org'), '', 'throw new Error()', 0, 1_000
        )).rejects.toBe(error);

        expect(mocks.window.Close).toHaveBeenCalledOnce();
    });

    it('rejects when opening the remote window fails', async () => {
        const error = new Error('open failed');
        mocks.window = CreateWindow({ openError: error });

        await expect(testee.FetchWindowPreloadScript(
            new Request('https://example.org'), '', 'true', 0, 1_000
        )).rejects.toBe(error);

        expect(mocks.window.Close).toHaveBeenCalledOnce();
    });
});

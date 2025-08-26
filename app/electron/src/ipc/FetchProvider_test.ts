import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { FetchProvider } from './FetchProvider';
import { FetchProvider as Channels } from '../../../src/ipc/Channels';

class TestFixture {

    public static PrefixHeader(name: string = '') {
        return 'X-FetchAPI-' + name;
    }

    public readonly mockIPC = {
        Listen: vi.fn(),
    };

    public readonly mockWebContents = {
        getURL: vi.fn(),
        session: {
            webRequest: {
                onHeadersReceived: vi.fn(),
                onBeforeSendHeaders: vi.fn(),
            }
        }
    };

    public CreateTestee(url: string, performInitialize: boolean) {
        const testee = {
            instance: null as FetchProvider,
            onHeadersReceivedListener: null as Parameters<Electron.WebRequest[ 'onHeadersReceived' ]>[ 0 ],
            onBeforeSendHeadersListener: null as Parameters<Electron.WebRequest[ 'onBeforeSendHeaders' ]>[ 0 ],
        };
        this.mockWebContents.getURL.mockReturnValue(url);
        let initialize: (fetchApiSupportedPrefix: string) => void;
        this.mockIPC.Listen.mockImplementationOnce((_, init) => initialize = init);
        this.mockWebContents.session.webRequest.onHeadersReceived.mockImplementation(listener => testee.onHeadersReceivedListener = listener);
        this.mockWebContents.session.webRequest.onBeforeSendHeaders.mockImplementation(listener => testee.onBeforeSendHeadersListener = listener);
        testee.instance = new FetchProvider(this.mockIPC as unknown as IPC<never, never>, this.mockWebContents as unknown as WebContents);
        if (performInitialize) {
            initialize(TestFixture.PrefixHeader());
        }
        return testee;
    }

    public static async InvokeOnHeadersReceived(
        listener: Parameters<Electron.WebRequest[ 'onHeadersReceived' ]>[ 0 ],
        details: Partial<Electron.OnHeadersReceivedListenerDetails>
    ): Promise<Electron.HeadersReceivedResponse> {
        return new Promise(resolve => listener(details as Electron.OnHeadersReceivedListenerDetails, resolve));
    }

    public static async InvokeOnBeforeSendHeaders(
        listener: Parameters<Electron.WebRequest[ 'onBeforeSendHeaders' ]>[ 0 ],
        details: Partial<Electron.OnBeforeSendHeadersListenerDetails>
    ): Promise<Electron.BeforeSendResponse> {
        return new Promise(resolve => listener(details as Electron.OnBeforeSendHeadersListenerDetails, resolve));
    }
}

describe('FetchProvider', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee('http://local.host/-', false);
            expect(testee).toBeDefined();
            expect(fixture.mockIPC.Listen).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.Initialize, expect.anything());
        });
    });

    describe('OnBeforeSendHeaders', () => {

        it(`Should remove certain headers containing the application's hostname`, async () => {
            const { onBeforeSendHeadersListener } = new TestFixture().CreateTestee('http://local.host/-', true);
            const actual = await TestFixture.InvokeOnBeforeSendHeaders(onBeforeSendHeadersListener, {
                requestHeaders: {
                    'Origin': 'https://local.host/~',
                    'Referer': 'https://local.host/~',
                    'Test-Keep-Header': 'http://local.host/-',
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                requestHeaders: {
                    'test-keep-header': 'http://local.host/-',
                },
            });
        });

        it('Should apply prefixed headers', async () => {
            const { onBeforeSendHeadersListener } = new TestFixture().CreateTestee('http://local.host/-', true);
            const actual = await TestFixture.InvokeOnBeforeSendHeaders(onBeforeSendHeadersListener, {
                requestHeaders: {
                    'Test-Keep-Header': '===',
                    'Origin': 'http://local.host/-',
                    [ TestFixture.PrefixHeader('Origin') ]: 'https://manga.web/-',
                    [ TestFixture.PrefixHeader('Referer') ]: 'https://manga.net/-',
                    'Referer': 'http://local.host/-',
                    [ TestFixture.PrefixHeader('Test-Replace-Header') ]: '***',
                    'Test-Replace-Header': '-',
                    [ TestFixture.PrefixHeader('Test-Add-Header') ]: '+++',
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                requestHeaders: {
                    'test-keep-header': '===',
                    'origin': 'https://manga.web/-',
                    'referer': 'https://manga.net/-',
                    'test-replace-header': '***',
                    'test-add-header': '+++',
                },
            });
        });

        it('Should keep cookies from original header', async () => {
            const { onBeforeSendHeadersListener } = new TestFixture().CreateTestee('http://local.host/-', true);
            const actual = await TestFixture.InvokeOnBeforeSendHeaders(onBeforeSendHeadersListener, {
                requestHeaders: {
                    'Cookie': 'x=3; o=7',
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                requestHeaders: {
                    'cookie': 'x=3; o=7',
                },
            });
        });

        it('Should apply cookies from prefixed header', async () => {
            const { onBeforeSendHeadersListener } = new TestFixture().CreateTestee('http://local.host/-', true);
            const actual = await TestFixture.InvokeOnBeforeSendHeaders(onBeforeSendHeadersListener, {
                requestHeaders: {
                    'X-FetchAPI-Cookie': 'x=3; o=7',
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                requestHeaders: {
                    'cookie': 'x=3; o=7',
                },
            });
        });

        it('Should merge cookies from original and prefixed header', async () => {
            const { onBeforeSendHeadersListener } = new TestFixture().CreateTestee('http://local.host/-', true);
            const actual = await TestFixture.InvokeOnBeforeSendHeaders(onBeforeSendHeadersListener, {
                requestHeaders: {
                    'Cookie': 'x=3; o=7;',
                    'X-FetchAPI-Cookie': 'o=11; _=0',
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                requestHeaders: {
                    'cookie': 'x=3; o=7; o=11; _=0',
                },
            });
        });
    });

    describe('OnHeadersReceived', () => {

        it('Should remove certain headers', async () => {
            const { onHeadersReceivedListener } = new TestFixture().CreateTestee('http://local.host/-', true);
            const actual = await TestFixture.InvokeOnHeadersReceived(onHeadersReceivedListener, {
                responseHeaders: {
                    'X-Link': [ '=' ],
                    'Link': [ '-' ],
                    'Test-Keep-Header': [ '===' ],
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                responseHeaders: {
                    'x-link': [ '=' ],
                    'test-keep-header': [ '===' ],
                },
            });
        });
    });
});
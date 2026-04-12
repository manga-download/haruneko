import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { Channels } from './InterProcessCommunicationChannels';
import { FetchProvider } from './FetchProvider';

class TestFixture {

    private onHeadersReceivedListener: Parameters<Electron.WebRequest['onHeadersReceived']>[0] = null;
    private onBeforeSendHeadersListener: Parameters<Electron.WebRequest['onBeforeSendHeaders']>[0] = null;

    public readonly Testee: FetchProvider;

    public readonly AppURL = new URL('http://local.host/-');

    public readonly MockIPC = {
        Handle: vi.fn(),
    };

    private readonly MockWebContents = {
        getURL: vi.fn(),
        session: {
            webRequest: {
                onHeadersReceived: vi.fn(),
                onBeforeSendHeaders: vi.fn(),
            },
            cookies: {
                get: vi.fn(),
            }
        }
    };

    constructor(cookies: ({ name: string, value: string })[] = []) {
        this.MockWebContents.getURL.mockReturnValue(this.AppURL);
        this.MockWebContents.session.cookies.get.mockReturnValue(Promise.resolve(cookies));
        this.MockIPC.Handle.mockImplementationOnce((_, initialize) => initialize(TestFixture.PrefixHeader()));
        this.MockWebContents.session.webRequest.onHeadersReceived.mockImplementationOnce(listener => this.onHeadersReceivedListener = listener);
        this.MockWebContents.session.webRequest.onBeforeSendHeaders.mockImplementationOnce(listener => this.onBeforeSendHeadersListener = listener);
        this.Testee = new FetchProvider(this.MockIPC as unknown as IPC, this.MockWebContents as unknown as WebContents);
    }

    public static PrefixHeader(name: string = '') {
        return 'X-FetchAPI-' + name;
    }

    public async InvokeOnHeadersReceived(
        details: Partial<Electron.OnHeadersReceivedListenerDetails>
    ): Promise<Electron.HeadersReceivedResponse> {
        return new Promise(resolve => this.onHeadersReceivedListener!(details as Electron.OnHeadersReceivedListenerDetails, resolve));
    }

    public async InvokeOnBeforeSendHeaders(
        details: Partial<Electron.OnBeforeSendHeadersListenerDetails>
    ): Promise<Electron.BeforeSendResponse> {
        return new Promise(resolve => this.onBeforeSendHeadersListener!(details as Electron.OnBeforeSendHeadersListenerDetails, resolve));
    }
}

describe('FetchProvider', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            expect(fixture.Testee).toBeDefined();
            expect(fixture.MockIPC.Handle).toHaveBeenCalledTimes(1);
            expect(fixture.MockIPC.Handle).toHaveBeenCalledWith(Channels.FetchProvider.Initialize, expect.anything());
        });
    });

    describe('OnBeforeSendHeaders', () => {

        it(`Should remove certain headers containing the application's hostname`, async () => {
            const fixture = new TestFixture();
            const actual = await fixture.InvokeOnBeforeSendHeaders({
                requestHeaders: {
                    'Origin': 'https://local.host',
                    'Referer': 'https://local.host/o/-',
                    'Test-Keep-Header': 'http://local.host/x',
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                requestHeaders: {
                    'test-keep-header': 'http://local.host/x',
                },
            });
        });

        it('Should apply prefixed headers', async () => {
            const fixture = new TestFixture();
            const actual = await fixture.InvokeOnBeforeSendHeaders({
                requestHeaders: {
                    'Test-Keep-Header': '===',
                    'Origin': fixture.AppURL.origin,
                    [ TestFixture.PrefixHeader('Origin') ]: 'https://manga.web/-',
                    [ TestFixture.PrefixHeader('Referer') ]: 'https://manga.net/-',
                    'Referer': fixture.AppURL.href,
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
            const fixture = new TestFixture();
            const actual = await fixture.InvokeOnBeforeSendHeaders({
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
            const fixture = new TestFixture();
            const actual = await fixture.InvokeOnBeforeSendHeaders({
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
            const fixture = new TestFixture();
            const actual = await fixture.InvokeOnBeforeSendHeaders({
                requestHeaders: {
                    'X-FetchAPI-Cookie': 'o=11; _ = 27 ; 0=; =0',
                    'Cookie': 'x=3; o=7; 0=; =0',
                }
            });
            expect(actual).toStrictEqual({
                cancel: false,
                requestHeaders: {
                    'cookie': 'x=3; o=11; _=27',
                },
            });
        });
    });

    describe('OnHeadersReceived', () => {

        it('Should remove certain headers', async () => {
            const fixture = new TestFixture();
            const actual = await fixture.InvokeOnHeadersReceived({
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
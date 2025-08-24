import { vi, describe, it, expect } from 'vitest';
import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { FetchProvider } from './FetchProvider';
import { FetchProvider as Channels } from '../../../src/ipc/Channels';

class TestFixture {

    public readonly mockIPC = {
        Listen: vi.fn(),
    } as unknown as IPC<never, never>;

    private readonly mockWebContents = {
        session: {
            webRequest: {
                onHeadersReceived: vi.fn(),
                onBeforeSendHeaders: vi.fn(),
            }
        }
    } as unknown as WebContents;

    public CreatTestee() {
        vi.mocked(this.mockIPC.Listen).mockImplementationOnce((_, init) => this.#initialize = init);
        vi.mocked(this.mockWebContents.session.webRequest.onHeadersReceived).mockImplementationOnce(listener => this.#onHeadersReceivedListener = listener);
        vi.mocked(this.mockWebContents.session.webRequest.onBeforeSendHeaders).mockImplementationOnce(listener => this.#onBeforeSendHeadersListener = listener);
        return new FetchProvider(this.mockIPC, this.mockWebContents);
    }

    #initialize: (fetchApiSupportedPrefix: string) => Promise<void>;
    /**
     * Invoke the `Initialize` method of the current testee
     * @remarks ⚠️ A testee must be created (with {@link CreatTestee}) in order to use this method
     */
    public InvokeInitialize(): void {
        this.#initialize('X-FetchAPI-');
    }

    #onHeadersReceivedListener: Parameters<Electron.WebRequest[ 'onHeadersReceived' ]>[ 0 ];
    /**
     * Invoke the listener for the `onHeadersReceived` event which was registered by the current testee
     * @remarks ⚠️ The current testee must be initialized (with {@link InvokeInitialize}) to register the listener
     */
    public async InvokeOnHeadersReceived(details: Partial<Electron.OnHeadersReceivedListenerDetails>): Promise<Electron.HeadersReceivedResponse> {
        return new Promise(resolve => this.#onHeadersReceivedListener(details as Electron.OnHeadersReceivedListenerDetails, resolve));
    }

    #onBeforeSendHeadersListener: Parameters<Electron.WebRequest[ 'onBeforeSendHeaders' ]>[ 0 ];
    /**
     * Invoke the listener for the `onBeforeSendHeaders` event which was registered by the current testee
     * @remarks ⚠️ The current testee must be initialized (with {@link InvokeInitialize}) to register the listener
     */
    public async InvokeOnBeforeSendHeaders(details: Partial<Electron.OnBeforeSendHeadersListenerDetails>): Promise<Electron.BeforeSendResponse> {
        return new Promise(resolve => this.#onBeforeSendHeadersListener(details as Electron.OnBeforeSendHeadersListenerDetails, resolve));
    }
}

describe('FetchProvider', () => {

    describe('Constructor', () => {

        it('Should subscribe to IPC events', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreatTestee();
            expect(testee).toBeDefined();
            expect(fixture.mockIPC.Listen).toHaveBeenCalledTimes(1);
            expect(fixture.mockIPC.Listen).toHaveBeenCalledWith(Channels.App.Initialize, expect.anything());
        });
    });

    describe('OnBeforeSendHeaders', () => {

        it('Should ...', async () => {
            const fixture = new TestFixture();
            fixture.CreatTestee();
            fixture.InvokeInitialize();
            const actual = await fixture.InvokeOnBeforeSendHeaders({ requestHeaders: { 'X-MyTest': '123' } });
            console.log('+++ ACTUAL:', actual);
        });
    });

    describe('OnHeadersReceived', () => {

        it('Should ...', async () => {
            const fixture = new TestFixture();
            fixture.CreatTestee();
            fixture.InvokeInitialize();
            const actual = await fixture.InvokeOnHeadersReceived({ responseHeaders: { 'X-MyTest': [ '123' ] } });
            console.log('+++ ACTUAL:', actual);
        });
    });
});
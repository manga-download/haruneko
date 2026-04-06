// @vitest-environment jsdom
import { vi, describe, it, expect } from 'vitest';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunicationChannels';
import type { FeatureFlags } from '../../FeatureFlags';
import FetchProvider from './FetchProvider';

class TestFixture {

    public readonly MockIpcRenderer = {
        invoke: vi.fn(),
    };

    constructor() {
        globalThis.Request = null;
        globalThis.ipcRenderer = this.MockIpcRenderer as unknown as Electron.IpcRenderer;
    }

    public CreateTestee() {
        return new FetchProvider();
    }
}

describe('FetchProvider', () => {

    describe('Initialize', () => {

        it('Should invoke initialize via IPC', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            testee.Initialize({} as FeatureFlags);
            expect(fixture.MockIpcRenderer.invoke).toHaveBeenCalledTimes(1);
            expect(fixture.MockIpcRenderer.invoke).toHaveBeenCalledWith(Channels.FetchProvider.Initialize, 'X-FetchAPI-');
        });

        it('Should replace the global Request type', () => {
            const testee = new TestFixture().CreateTestee();
            expect(globalThis.Request).toBeNull();
            testee.Initialize({} as FeatureFlags);
            expect(globalThis.Request.name).toBe('FetchRequest');
        });
    });

    describe('Request', () => {

        it('Should add prefix for unsupported fetch API headers', async () => {
            new TestFixture().CreateTestee().Initialize({} as FeatureFlags);
            const request = new Request('http://hakuneko.app/', {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'UserAgent',
                    'Referer': 'protocol://domain',
                    'Cookie': 'user=abc; pass=123',
                    'Origin': 'protocol://origin',
                    'Host': 'domain'
                }
            });

            expect(request.headers.get('Content-Type')).toBe('application/json');
            expect(request.headers.has('X-FetchAPI-Content-Type')).toBeFalsy();
            expect(request.headers.has('User-Agent')).toBeFalsy();
            expect(request.headers.get('X-FetchAPI-User-Agent')).toBe('UserAgent');
            expect(request.headers.has('Referer')).toBeFalsy();
            expect(request.headers.get('X-FetchAPI-Referer')).toBe('protocol://domain');
            expect(request.headers.has('Cookie')).toBeFalsy();
            expect(request.headers.get('X-FetchAPI-Cookie')).toBe('user=abc; pass=123');
            expect(request.headers.has('Origin')).toBeFalsy();
            expect(request.headers.get('X-FetchAPI-Origin')).toBe('protocol://origin');
            expect(request.headers.has('Host')).toBeFalsy();
            expect(request.headers.get('X-FetchAPI-Host')).toBe('domain');
        });
    });

    describe('Fetch', () => {

        it('Should passthru GET to native fetch', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            testee.Initialize({} as FeatureFlags);
            const request = new Request('https://postman-echo.com/get', {
                headers: {
                    'User-Agent': 'HakuNeko',
                    'Referer': 'http://hakuneko.app/'
                }
            });

            await testee.Fetch(request);
            //expect(fixture.mockFetch).toBeCalledTimes(1);
            //expect(fixture.mockFetch).toHaveBeenCalledWith(request);
        });

        it('Should passthru POST to native fetch', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            testee.Initialize({} as FeatureFlags);
            const request = new Request('https://postman-echo.com/post', {
                method: 'POST',
                body: JSON.stringify({ a: 1, b: 2 }),
                headers: {
                    'User-Agent': 'HakuNeko',
                    'Referer': 'http://hakuneko.app/',
                    'Content-Type': 'application/json'
                }
            });

            await testee.Fetch(request);
            //expect(fixture.mockFetch).toBeCalledTimes(1);
            //expect(fixture.mockFetch).toHaveBeenCalledWith(request);
        });
    });
});
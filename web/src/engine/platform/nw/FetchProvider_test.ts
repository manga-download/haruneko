// @vitest-environment jsdom
import '../../ArrayExtensions';
import { mock } from 'vitest-mock-extended';
import { vi, describe, it, expect } from 'vitest';
import type { FeatureFlags } from '../../FeatureFlags';
import FetchProvider from './FetchProvider';

class TestFixture {

    public readonly mockFeatureFlags = mock<FeatureFlags>();
    public readonly mockFetch = vi.fn().mockReturnValueOnce({ headers: { get: () => {} } });
    public readonly chromeFake = {
        cookies: {
            getAll: vi.fn(),
        },
        webRequest: {
            onBeforeSendHeaders: mock<chrome.webRequest.WebRequestHeadersEvent>(),
            onHeadersReceived: mock<chrome.webRequest.WebResponseHeadersEvent>(),
        }
    };

    constructor(cookies: string = '') {
        globalThis.Request = null;
        globalThis.fetch = this.mockFetch;
        globalThis.chrome = this.chromeFake as unknown as typeof chrome;
        this.chromeFake.cookies.getAll.mockImplementation((details, callback?) => callback(this.ParseCookies(cookies)));
    }

    private ParseCookies(cookies: string): chrome.cookies.Cookie[] {
        return cookies.split(';').filter(cookie => cookie.includes('=')).map(cookie => {
            const [ name, value ] = cookie.split('=').map(c => c.trim());
            return { name, value } as chrome.cookies.Cookie;
        });
    }

    public CreateTestee(performInitialize: boolean) {
        const testee = new FetchProvider();
        if(performInitialize) {
            testee.Initialize(this.mockFeatureFlags);
        }
        return testee;
    }
}

describe('FetchProvider', () => {

    describe('Initialize', () => {

        it('Should replace global Request type', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee(false);
            expect(globalThis.Request).toBeNull();
            testee.Initialize(fixture.mockFeatureFlags);
            expect(globalThis.Request.name).toBe('FetchRequest');
        });

        it('Should register onBeforeSendHeaders modifier', () => {
            const fixture = new TestFixture();
            let testee: (details: chrome.webRequest.WebRequestHeadersDetails) => chrome.webRequest.BlockingResponse | void;
            fixture.chromeFake.webRequest.onBeforeSendHeaders.hasListener.mockReturnValue(false);
            fixture.chromeFake.webRequest.onBeforeSendHeaders.addListener.mockImplementation((callback) => testee = callback);
            fixture.CreateTestee(true);

            window.location = { origin: 'http://localhost' } as Location;
            const details = {
                requestHeaders: [
                    { name: 'Referer', value: 'http://localhost/' }, // should remove referer for current origin
                    { name: 'X-FetchAPI-Origin', value: '😈' }, // should remove prefix
                    { name: 'Host', value: '😇' }, // should keep as is
                ]
            } as chrome.webRequest.WebRequestHeadersDetails;
            const actual = testee(details) as chrome.webRequest.BlockingResponse;

            expect(testee.name).toBe('ModifyRequestHeaders');
            expect(actual.requestHeaders).toStrictEqual([
                { name: 'Origin', value: '😈' },
                { name: 'Host', value: '😇' },
            ]);
        });

        it('Should register onHeadersReceived modifier', () => {
            const fixture = new TestFixture();
            let testee: (details: chrome.webRequest.WebResponseHeadersDetails) => chrome.webRequest.BlockingResponse | void;
            fixture.chromeFake.webRequest.onHeadersReceived.hasListener.mockReturnValue(false);
            fixture.chromeFake.webRequest.onHeadersReceived.addListener.mockImplementation((callback) => testee = callback);
            fixture.CreateTestee(true);

            const details = {
                responseHeaders: [
                    { name: 'Link', value: 'http://cdn/' }, // should remove preload links
                    { name: 'X-FetchAPI-Origin', value: '😈' }, // should keep as is
                    { name: 'Host', value: '😇' }, // should keep as is
                ]
            } as chrome.webRequest.WebResponseHeadersDetails;
            const actual = testee(details) as chrome.webRequest.BlockingResponse;

            expect(testee.name).toBe('ModifyResponseHeaders');
            expect(actual.responseHeaders).toStrictEqual([
                { name: 'X-FetchAPI-Origin', value: '😈' },
                { name: 'Host', value: '😇' },
            ]);
        });
    });

    describe('Request', () => {

        it('Should add prefix for unsupported fetch API headers', async () => {
            new TestFixture().CreateTestee(true);
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
            const testee = fixture.CreateTestee(true);
            const request = new Request('https://postman-echo.com/get', {
                headers: {
                    'User-Agent': 'HakuNeko',
                    'Referer': 'http://hakuneko.app/'
                }
            });

            await testee.Fetch(request);
            expect(fixture.mockFetch).toBeCalledTimes(1);
            expect(fixture.mockFetch).toHaveBeenCalledWith(request);
        });

        it('Should passthru POST to native fetch', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee(true);
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
            expect(fixture.mockFetch).toBeCalledTimes(1);
            expect(fixture.mockFetch).toHaveBeenCalledWith(request);
        });

        it.each([
            [ '', '', '' ],
            [ 'b=3; c=4', '', 'b=3; c=4' ],
            [ '', 'a=1; b=2', 'a=1; b=2' ],
            [ 'b=3; c=4', 'a=1; b=2', 'a=1; b=2; c=4' ],
        ])(`Should merge request and browser cookies '%s' + '%s' => '%s'`, async (browserCookies: string, requestCookies: string, expectedCookies: string) => {
            const fixture = new TestFixture(browserCookies);
            const testee = fixture.CreateTestee(true);
            const request = new Request('http://hakuneko.app/', {
                headers: { 'Cookie': requestCookies }
            });

            await testee.Fetch(request);

            expect(request.headers.has('Cookie')).toBeFalsy();
            expect(request.headers.get('X-FetchAPI-Cookie')).toBe(expectedCookies);
        });
    });
});
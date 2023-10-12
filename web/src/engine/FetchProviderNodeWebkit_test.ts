import { mock, mockClear, mockFn } from 'jest-mock-extended';
import { RevealWebRequestHeaders, FetchRequest, Fetch } from './FetchProviderNodeWebkit';
global.fetch = mockFn<(input: URL | RequestInfo, init?: RequestInit) => Promise<Response>>();
const cookies = mock<typeof chrome.cookies>();
global.chrome = { cookies: cookies } as unknown as typeof chrome;

function CreateCookies(cookies: string): chrome.cookies.Cookie[] {
    const result: chrome.cookies.Cookie[] = [];
    for(const cookie of cookies.split(';')) {
        const [ name, value ] = cookie.split('=').map(c => c.trim());
        const c = mock<chrome.cookies.Cookie>();
        c.name = name;
        c.value = value;
        result.push(c);
    }
    return result;
}

describe('FetchProvider', () => {

    describe('RevealFetchAPIHeaders', () => {

        it('Should replace prefixed fetch API headers', async () => {
            const headers = [
                { name: 'X-FetchAPI-Content-Type', value: 'application/json' },
                { name: 'X-FetchAPI-User-Agent', value: 'UserAgent' },
                { name: 'X-FetchAPI-Referer', value: 'protocol://domain' },
                { name: 'X-FetchAPI-Host', value: 'domain' },
                { name: 'X-FetchAPI-Origin', value: 'protocol://origin' }
            ];
            const actual = RevealWebRequestHeaders(headers);

            expect(actual.length).toBe(5);
            expect(actual.find(h => h.name === 'X-FetchAPI-Content-Type')).toBeUndefined();
            expect(actual.find(h => h.name === 'Content-Type')?.value).toBe('application/json');
            expect(actual.find(h => h.name === 'X-FetchAPI-User-Agent')).toBeUndefined();
            expect(actual.find(h => h.name === 'User-Agent')?.value).toBe('UserAgent');
            expect(actual.find(h => h.name === 'X-FetchAPI-Referer')).toBeUndefined();
            expect(actual.find(h => h.name === 'Referer')?.value).toBe('protocol://domain');
            expect(actual.find(h => h.name === 'X-FetchAPI-Host')).toBeUndefined();
            expect(actual.find(h => h.name === 'Host')?.value).toBe('domain');
            expect(actual.find(h => h.name === 'X-FetchAPI-Origin')).toBeUndefined();
            expect(actual.find(h => h.name === 'Origin')?.value).toBe('protocol://origin');
        });

        // TODO: test replace existing headers, e.g. referer

        // TODO: test case sensitivity
    });
});

describe('FetchRequest', () => {

    beforeEach(() => mockClear(cookies));

    describe('constructor()', () => {

        it('Should initilize with expected values', async () => {
            const testee = new FetchRequest('http://hakuneko.app/', {
                method: 'POST',
                body: 'a=1&b=2'
            });
            expect(testee.url).toBe('http://hakuneko.app/');
            expect(testee.method).toBe('POST');
            expect(await testee.text()).toBe('a=1&b=2');
        });

        it('Should prefix unsupported fetch API headers', async () => {
            const testee = new FetchRequest('http://hakuneko.app/', {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'UserAgent',
                    'Referer': 'protocol://domain',
                    'Cookie': 'user=abc; pass=123',
                    'Origin': 'protocol://origin',
                    'Host': 'domain'
                }
            });

            expect(testee.headers.get('Content-Type')).toBe('application/json');
            expect(testee.headers.has('X-FetchAPI-Content-Type')).toBeFalsy();
            expect(testee.headers.has('User-Agent')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-User-Agent')).toBe('UserAgent');
            expect(testee.headers.has('Referer')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Referer')).toBe('protocol://domain');
            expect(testee.headers.has('Cookie')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Cookie')).toBe('user=abc; pass=123');
            expect(testee.headers.has('Origin')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Origin')).toBe('protocol://origin');
            expect(testee.headers.has('Host')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Host')).toBe('domain');
        });

        // TODO: test case sensitivity
    });

    describe('UpdateCookieHeader()', () => {

        it('Should work without request cookies and without browser cookies', async () => {
            cookies.getAll.mockResolvedValue([]);
            const testee = new FetchRequest('http://hakuneko.app/');
            await testee.UpdateCookieHeader();
            expect(testee.headers.get('Cookie')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Cookie')).toBeFalsy();
        });

        it('Should work without request cookies and with browser cookies', async () => {
            cookies.getAll.mockResolvedValue(CreateCookies('b=3; c=4'));
            const testee = new FetchRequest('http://hakuneko.app/');
            await testee.UpdateCookieHeader();
            expect(testee.headers.get('Cookie')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Cookie')).toBe('b=3; c=4');
        });

        it('Should work with request cookies and without browser cookies', async () => {
            cookies.getAll.mockResolvedValue([]);
            const testee = new FetchRequest('http://hakuneko.app/', {
                headers: {
                    Cookie: 'a=1; b=2'
                }
            });
            await testee.UpdateCookieHeader();
            expect(testee.headers.get('Cookie')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Cookie')).toBe('a=1; b=2');
        });

        it('Should work with request cookies and with browser cookies', async () => {
            cookies.getAll.mockResolvedValue(CreateCookies('b=3; c=4'));
            const testee = new FetchRequest('http://hakuneko.app/', {
                headers: {
                    Cookie: 'a=1; b=2'
                }
            });
            await testee.UpdateCookieHeader();
            expect(testee.headers.get('Cookie')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Cookie')).toBe('a=1; b=2; c=4');
        });
    });
});

describe('FetchProvider', () => {

    describe('Fetch', () => {

        beforeEach(() => mockClear(cookies));
        beforeEach(() => mockClear(global.fetch)); // mockReset(global.fetch)

        it('Should passthru GET to native fetch', async () => {
            const request = new FetchRequest('https://postman-echo.com/get', {
                headers: {
                    'User-Agent': 'HakuNeko',
                    'Referer': 'http://hakuneko.app/'
                }
            });

            await Fetch(request);
            expect(global.fetch).toBeCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(request);
        });

        it('Should passthru POST to native fetch', async () => {
            const request = new FetchRequest('https://postman-echo.com/post', {
                method: 'POST',
                body: JSON.stringify({ a: 1, b: 2 }),
                headers: {
                    'User-Agent': 'HakuNeko',
                    'Referer': 'http://hakuneko.app/',
                    'Content-Type': 'application/json'
                }
            });

            await Fetch(request);
            expect(global.fetch).toBeCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(request);
        });
    });
});
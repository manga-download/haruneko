import { mockClear, mockFn } from 'jest-mock-extended';
global.fetch = mockFn<(input: RequestInfo, init?: RequestInit) => Promise<Response>>();
import { ConcealFetchHeaders, RevealWebRequestHeaders, FetchRequest, Fetch } from './FetchProviderNodeWebkit';

describe('FetchProvider', () => {

    describe('ConcealFetchAPIHeaders', () => {

        it('Should prefix unsupported fetch API headers', async () => {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'User-Agent': 'UserAgent',
                'Referer': 'protocol://domain',
                'Host': 'domain',
                'Origin': 'protocol://origin'
            });
            ConcealFetchHeaders(headers);

            expect(headers.get('Content-Type')).toBe('application/json');
            expect(headers.has('X-FetchAPI-Content-Type')).toBeFalsy();
            expect(headers.has('User-Agent')).toBeFalsy();
            expect(headers.get('X-FetchAPI-User-Agent')).toBe('UserAgent');
            expect(headers.has('Referer')).toBeFalsy();
            expect(headers.get('X-FetchAPI-Referer')).toBe('protocol://domain');
            expect(headers.has('Host')).toBeFalsy();
            expect(headers.get('X-FetchAPI-Host')).toBe('domain');
            expect(headers.has('Origin')).toBeFalsy();
            expect(headers.get('X-FetchAPI-Origin')).toBe('protocol://origin');
        });

        // TODO: test case sensitivity
    });

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
                    'Origin': 'protocol://origin',
                    'Host': 'domain'
                }
            });

            expect(testee.headers.get('Content-Type')).toBe('application/json');
            expect(testee.headers.has('User-Agent')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-User-Agent')).toBe('UserAgent');
            expect(testee.headers.has('Referer')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Referer')).toBe('protocol://domain');
            expect(testee.headers.has('Host')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Host')).toBe('domain');
            expect(testee.headers.has('Origin')).toBeFalsy();
            expect(testee.headers.get('X-FetchAPI-Origin')).toBe('protocol://origin');
        });
    });
});

describe('FetchProvider', () => {

    describe('Fetch', () => {

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
// @vitest-environment jsdom
import { mock } from 'vitest-mock-extended';
import { describe, it, expect } from 'vitest';
import type { FeatureFlags } from '../../FeatureFlags';
import FetchProvider from './FetchProvider';
import type { IPC } from '../InterProcessCommunication';

class TestFixture {

    public readonly mockFeatureFlags = mock<FeatureFlags>();
    public readonly mockIPC = mock<IPC<string, never>>();

    public CreateTestee(performInitialize: boolean) {
        const testee = new FetchProvider(this.mockIPC);
        if (performInitialize) {
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
            //expect(fixture.mockFetch).toBeCalledTimes(1);
            //expect(fixture.mockFetch).toHaveBeenCalledWith(request);
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
            //expect(fixture.mockFetch).toBeCalledTimes(1);
            //expect(fixture.mockFetch).toHaveBeenCalledWith(request);
        });
    });
});
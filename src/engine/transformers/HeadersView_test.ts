import { HeadersView } from './HeadersView';

describe('HeadersView', () => {

    describe('has()', () => {

        it('Should be truthy when header exist', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            expect(testee.has('Referer')).toBe(true);
        });

        it('Should be falsy when header not exist', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            expect(testee.has('token')).toBe(false);
        });

        it('Should be case insensitive', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            expect(testee.has('refereR')).toBe(true);
        });
    });

    describe('get()', () => {

        it('Should return value when header exist', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            expect(testee.get('Referer')).toBe(headers[0].value);
        });

        it('Should return null when header not exist', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            expect(testee.get('X-Token')).toBe(null);
        });

        it('Should be case insensitive', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            expect(testee.get('refereR')).toBe(headers[0].value);
        });
    });

    describe('set()', () => {

        it('Should update existing header (valid value)', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            testee.set('Referer', 'x');
            expect(headers.length).toBe(1);
            expect(headers[0].name).toBe('Referer');
            expect(headers[0].value).toBe('x');
        });

        it('Should update existing header (null value)', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            testee.set('Referer', null);
            expect(headers.length).toBe(1);
            expect(headers[0].name).toBe('Referer');
            expect(headers[0].value).toBe(undefined);
        });

        it('Should append non-existing header (valid value)', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            testee.set('X-Token', 'x');
            expect(headers.length).toBe(2);
            expect(headers[0].name).toBe('Referer');
            expect(headers[0].value).toBe('protocol://domain');
            expect(headers[1].name).toBe('X-Token');
            expect(headers[1].value).toBe('x');
        });

        it('Should append non-existing header (null value)', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            testee.set('X-Token', null);
            expect(headers.length).toBe(2);
            expect(headers[0].name).toBe('Referer');
            expect(headers[0].value).toBe('protocol://domain');
            expect(headers[1].name).toBe('X-Token');
            expect(headers[1].value).toBe(undefined);
        });

        it('Should be case insensitive', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            testee.set('refereR', 'x');
            expect(headers.length).toBe(1);
            expect(headers[0].name).toBe('Referer');
            expect(headers[0].value).toBe('x');
        });
    });

    describe('delete()', () => {

        it('Should remove existing header', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            testee.delete('Referer');
            expect(headers.length).toBe(0);
        });

        it('Should remove existing header', async () => {
            const headers = [
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            testee.delete('X-Token');
            expect(headers.length).toBe(1);
            expect(headers[0].name).toBe('Referer');
            expect(headers[0].value).toBe('protocol://domain');
        });
    });
});
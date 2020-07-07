import { HeaderProcessor } from './HeaderProcessor';

function AssertHeader(header: chrome.webRequest.HttpHeader, expected: chrome.webRequest.HttpHeader) {
    expect(header.name.toLowerCase()).toBe(expected.name.toLowerCase());
    expect(header.value).toBe(expected.value);
}

describe('HeaderProcessor', () => {

    describe('GetHeaders()', () => {

        it('Should use clone of initialization headers', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderProcessor(headers);
            const expectedFirstHeader = headers.shift();
            const expectedLastHeader = headers.pop();
            const result = testee.GetHeaders();
            expect(result.length).toBe(2);
            expect(result).toBe(testee.GetHeaders());
            AssertHeader(result.shift(), expectedFirstHeader);
            AssertHeader(result.pop(), expectedLastHeader);
        });
    });

    describe('ContainsHeader()', () => {

        it('Should be true when header exist', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            expect(testee.ContainsHeader('User-Agent')).toBeTruthy();
            expect(testee.ContainsHeader('user-agent')).toBeTruthy();
        });

        it('Should be false when header not exist', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            expect(testee.ContainsHeader('Agent-User')).toBeFalsy();
        });
    });

    describe('GetHeader()', () => {

        it('Should return header when exist', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            AssertHeader(testee.GetHeader('User-Agent'), headers[0]);
            AssertHeader(testee.GetHeader('user-agent'), headers[0]);
        });

        it('Should return null when not exist', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            expect(testee.GetHeader('Agent-User')).toBe(null);
        });
    });

    describe('SetHeader()', () => {

        it('Should add non-existing header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            testee.SetHeader('Referer', 'protocol://domain');
            const result = testee.GetHeaders();
            expect(result.length).toBe(2);
            AssertHeader(result[0], headers[0]);
            AssertHeader(result[1], { name: 'referer', value: 'protocol://domain' });
        });
    
        it('Should update existing header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            testee.SetHeader('User-Agent', 'Firefox');
            expect(testee.GetHeader('user-agent').value).toBe('Firefox');
            testee.SetHeader('user-agent', 'Chrome');
            expect(testee.GetHeader('User-Agent').value).toBe('Chrome');
            expect(testee.GetHeaders().length).toBe(1);
        }); 
    });

    describe('Delete()', () => {

        it('Should delete existing header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            let testee = new HeaderProcessor(headers);
            testee.DeleteHeader('User-Agent');
            testee.DeleteHeader('referer');
            expect(testee.GetHeaders().length).toBe(0);
        });

        it('Should ignore non-existing header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            testee.DeleteHeader('referer');
            const result = testee.GetHeaders();
            expect(result.length).toBe(1);
            AssertHeader(result[0], headers[0]);
        });  
    });

    describe('ReplaceHeaderName()', () => {

        it('Should rename existing header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            let testee = new HeaderProcessor(headers);
            testee.ReplaceHeaderName('User-Agent', 'X-User-Agent');
            testee.ReplaceHeaderName('referer', 'x-referer');
            const result = testee.GetHeaders();
            expect(result.length).toBe(2);
            AssertHeader(result[0], { name: 'x-user-agent', value: 'Mozilla/5.0' });
            AssertHeader(result[1], { name: 'x-referer', value: 'protocol://domain' });
        });

        it('Should skip when old name is equivalent to new name', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            let testee = new HeaderProcessor(headers);
            testee.ReplaceHeaderName('User-Agent', 'user-agent');
            testee.ReplaceHeaderName('referer', 'Referer');
            const result = testee.GetHeaders();
            expect(result.length).toBe(headers.length);
            AssertHeader(result[0], headers[0]);
            AssertHeader(result[1], headers[1]);
        });

        it('Should throw when old header name not exist', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' }
            ];
            let testee = new HeaderProcessor(headers);
            expect(() => testee.ReplaceHeaderName('Referer', 'X-Referer')).toThrow(Error);
        });

        it('Should throw when new header name already exist', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            let testee = new HeaderProcessor(headers);
            expect(() => testee.ReplaceHeaderName('User-Agent', 'Referer')).toThrow(Error);
        });  
    });
});
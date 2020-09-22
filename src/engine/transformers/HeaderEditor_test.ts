import { mock } from 'jest-mock-extended';
import { HeaderEditor, ConcealHeaders, RevealHeaders } from './HeaderEditor';

describe('ConcealHeaders', () => {

    it('Should rename unsupported fetch API headers', async () => {
        const headersMock = mock<Headers>();
        //headersMock.get.mockReturnValue(null);
        headersMock.get.calledWith('Content-Type').mockReturnValue('application/json');
        headersMock.get.calledWith('User-Agent').mockReturnValue('Mozilla/5.0');
        headersMock.get.calledWith('Referer').mockReturnValue('protocol://domain');
        headersMock.get.calledWith('Host').mockReturnValue('domain');
        headersMock.get.calledWith('Origin').mockReturnValue(null);
        headersMock.get.calledWith('Cookie').mockReturnValue(null);

        ConcealHeaders(headersMock);

        expect(headersMock.delete).toHaveBeenCalledTimes(3);
        expect(headersMock.delete).toHaveBeenCalledWith(expect.stringMatching(/^user-agent$/i));
        expect(headersMock.delete).toHaveBeenCalledWith(expect.stringMatching(/^referer$/i));
        expect(headersMock.delete).toHaveBeenCalledWith(expect.stringMatching(/^host$/i));

        expect(headersMock.append).toHaveBeenCalledTimes(3);
        expect(headersMock.append).toHaveBeenCalledWith(expect.stringMatching(/^x-user-agent$/i), 'Mozilla/5.0');
        expect(headersMock.append).toHaveBeenCalledWith(expect.stringMatching(/^x-referer$/i), 'protocol://domain');
        expect(headersMock.append).toHaveBeenCalledWith(expect.stringMatching(/^x-host$/i), 'domain');
    });
});

describe('RevealHeaders', () => {

    it('Should ...', async () => {
        const headers = [
            { name: 'User-Agent', value: 'Mozilla/5.0' },
            { name: 'Referer', value: 'protocol://domain' }
        ];
        const testee = new HeaderEditor(headers);
        RevealHeaders(testee);
        throw new Error('Not Implemented!');
    });
});

describe('HeaderEditor', () => {

    describe('AddHeader()', () => {

        it('Should append non-existing header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderEditor(headers);
            testee.AddHeader('Token', 'x', false);
            expect(headers.length).toBe(3);
            expect(headers[0].value).toBe('Mozilla/5.0');
            expect(headers[1].value).toBe('protocol://domain');
            expect(headers[2].name).toBe('Token');
            expect(headers[2].value).toBe('x');
        });

        it('Should append existing header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderEditor(headers);
            testee.AddHeader('Referer', 'x', false);
            expect(headers.length).toBe(3);
            expect(headers[0].value).toBe('Mozilla/5.0');
            expect(headers[1].value).toBe('protocol://domain');
            expect(headers[2].name).toBe('Referer');
            expect(headers[2].value).toBe('x');
        });

        it('Should not append existing exclusive header', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderEditor(headers);
            testee.AddHeader('referer', 'x', true);
            expect(headers.length).toBe(2);
            expect(headers[0].value).toBe('Mozilla/5.0');
            expect(headers[1].value).toBe('protocol://domain');
        });
    });

    describe('SetHeaders()', () => {

        it('Should append non-matching headers', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderEditor(headers);
            testee.SetHeaders('Token', 'x');
            expect(headers.length).toBe(3);
            expect(headers[0].value).toBe('Mozilla/5.0');
            expect(headers[1].value).toBe('protocol://domain');
            expect(headers[2].name).toBe('Token');
            expect(headers[2].value).toBe('x');
        });

        it('Should update all matching headers', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' },
                { name: 'referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderEditor(headers);
            testee.SetHeaders('RefereR', 'x');
            expect(headers.length).toBe(3);
            expect(headers[0].value).toBe('Mozilla/5.0');
            expect(headers[1].value).toBe('x');
            expect(headers[2].value).toBe('x');
        });
    });

    describe('RenameHeaders()', () => {

        it('Should ignore non-matching headers', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderEditor(headers);
            testee.RenameHeaders('Token', 'x');
            expect(headers.length).toBe(2);
            expect(headers[0].name).toBe('User-Agent');
            expect(headers[1].name).toBe('Referer');
        });

        it('Should update all matching headers', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'X-Referer', value: 'protocol://domain' },
                { name: 'x-referer', value: 'protocol://domain' }
            ];
            const testee = new HeaderEditor(headers);
            testee.RenameHeaders('X-RefereR', 'Referer');
            expect(headers.length).toBe(3);
            expect(headers[0].name).toBe('User-Agent');
            expect(headers[1].name).toBe('Referer');
            expect(headers[2].name).toBe('Referer');
        });
    });
});
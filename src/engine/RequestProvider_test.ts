import { mock } from 'jest-mock-extended';
import { HeadersView } from './transformers/HeadersView';
import { FetchRequest, RequestProvider } from './RequestProvider';

describe('FetchRequest', () => {

    describe('constructor()', () => {

        it('Should ...', async () => {
            throw new Error('Not Implemented!');
        });
    });

    describe('ConcealFetchAPIHeaders', () => {

        it('Should rename unsupported fetch API headers', async () => {
            const headersMock = mock<Headers>();
            headersMock.get.calledWith('Content-Type').mockReturnValue('application/json');
            headersMock.get.calledWith('User-Agent').mockReturnValue('Mozilla/5.0');
            headersMock.get.calledWith('Referer').mockReturnValue('protocol://domain');
            headersMock.get.calledWith('Host').mockReturnValue('domain');
            headersMock.get.calledWith('Origin').mockReturnValue(null);

            FetchRequest.ConcealFetchAPIHeaders(headersMock);

            expect(headersMock.get).toHaveBeenCalledTimes(4);
            expect(headersMock.get).toHaveBeenCalledWith('User-Agent');
            expect(headersMock.get).toHaveBeenCalledWith('Referer');
            expect(headersMock.get).toHaveBeenCalledWith('Origin');
            expect(headersMock.get).toHaveBeenCalledWith('Host');

            expect(headersMock.delete).toHaveBeenCalledTimes(3);
            expect(headersMock.delete).toHaveBeenCalledWith(expect.stringMatching(/^user-agent$/i));
            expect(headersMock.delete).toHaveBeenCalledWith(expect.stringMatching(/^referer$/i));
            expect(headersMock.delete).toHaveBeenCalledWith(expect.stringMatching(/^host$/i));

            expect(headersMock.set).toHaveBeenCalledTimes(3);
            expect(headersMock.set).toHaveBeenCalledWith(expect.stringMatching(/^x-fetchapi-user-agent$/i), 'Mozilla/5.0');
            expect(headersMock.set).toHaveBeenCalledWith(expect.stringMatching(/^x-fetchapi-referer$/i), 'protocol://domain');
            expect(headersMock.set).toHaveBeenCalledWith(expect.stringMatching(/^x-fetchapi-host$/i), 'domain');
        });
    });

    describe('RevealFetchAPIHeaders', () => {

        it('Should ...', async () => {
            const headers = [
                { name: 'User-Agent', value: 'Mozilla/5.0' },
                { name: 'Referer', value: 'protocol://domain' }
            ];
            const testee = new HeadersView(headers);
            FetchRequest.RevealFetchAPIHeaders(testee);
            throw new Error('Not Implemented!');
        });
    });
});
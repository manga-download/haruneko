import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'anchira',
        title: 'Anchira'
    },
    container: {
        url: 'https://anchira.to/g/13408/f2089e2060a0',
        id: JSON.stringify({ id: '13408', key: 'f2089e2060a0'}),
        title: 'Time to Part'
    },
    child: {
        id: JSON.stringify({ id: '13408', key: 'f2089e2060a0' }),
        title: 'Time to Part'
    },
    entry: {
        index: 0,
        size: 445_558,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
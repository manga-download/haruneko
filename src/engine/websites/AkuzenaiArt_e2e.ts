import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'anitationarts',
        title: 'Akuzenai Arts'
    },
    container: {
        url: 'https://akuzenaiarts.org/comic/the-first-sequence/',
        id: JSON.stringify({ post: '1936', slug: '/comic/the-first-sequence/' }),
        title: 'The First Sequence'
    },
    child: {
        id: '/comic/the-first-sequence/ch-1/',
        title: 'CH.1'
    },
    entry: {
        index: 0,
        size: 1_222_508,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
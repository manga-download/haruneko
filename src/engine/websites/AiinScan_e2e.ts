import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'aiinscan',
        title: 'Aiin Scan'
    },
    container: {
        url: 'https://aiinscan.xyz/manga/obra06/',
        id: JSON.stringify({ post: '635', slug: '/manga/obra06/' }),
        title: 'I Have a Dragon in My Body'
    },
    child: {
        id: '/manga/obra06/capitulo-200/',
        title: 'Capítulo 200'
    },
    entry: {
        index: 0,
        size: 2166982,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
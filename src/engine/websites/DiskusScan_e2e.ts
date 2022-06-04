import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'diskusscan',
        title: 'Diskus Scan'
    },
    container: {
        url: 'https://diskusscan.com/manga/shenwu-tianzun/',
        id: JSON.stringify({ post: '802', slug: '/manga/shenwu-tianzun/' }),
        title: 'Shenwu Tianzun'
    },
    child: {
        id: '/manga/shenwu-tianzun/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 3_427_181,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'glorymanga',
        title: 'GloryManga'
    },
    container: {
        url: 'https://glorymanga.com/manga/dragon-master/',
        id: JSON.stringify({ post: '12536', slug: '/manga/dragon-master/' }),
        title: 'Dragon Master'
    },
    child: {
        id: '/manga/dragon-master/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 240_765,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
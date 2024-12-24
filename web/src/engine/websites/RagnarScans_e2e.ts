import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ragnarscans',
        title: 'Ragnar Scans',
    },
    container: {
        url: 'https://ragnarscans.com/manga/gosu/',
        id: JSON.stringify({ post: '6377', slug: '/manga/gosu/'}),
        title: 'Gosu',
    },
    child: {
        id: '/manga/gosu/bolum-231/',
        title: 'Bölüm 231',
    },
    entry: {
        index: 2,
        size: 132_826,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ragnarscans',
        title: 'Ragnar Scans',
    },
    container: {
        url: 'https://ragnarscans.com/manga/code-geass-alternatif-son/',
        id: JSON.stringify({ post: '61060', slug: '/manga/code-geass-alternatif-son/'}),
        title: 'Code Geass: Alternatif Son',
    },
    child: {
        id: '/manga/code-geass-alternatif-son/bolum-0/',
        title: 'Bölüm 0',
    },
    entry: {
        index: 0,
        size: 204_517,
        type: 'image/jpeg'
    }
}).AssertWebsite();
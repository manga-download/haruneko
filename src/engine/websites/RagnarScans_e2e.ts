import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ragnarscans',
        title: 'Ragnar Scans',
    },
    container: {
        url: 'https://ragnarscans.com/manga/deli-iblisin-donusu/',
        id: '/manga/deli-iblisin-donusu/',
        title: 'Deli İblisin Dönüşü',
    },
    child: {
        id: '/manga/deli-iblisin-donusu/bolum-1/',
        title: 'Bölüm 1',
    },
    entry: {
        index: 2,
        size: 124_964,
        type: 'image/jpeg'
    }
}).AssertWebsite();
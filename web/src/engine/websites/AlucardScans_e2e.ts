import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'alucardscans',
        title: 'Alucard Scans'
    },
    container: {
        url: 'https://alucardscans.com/manga/zindan-efendisi/',
        id: '/manga/zindan-efendisi/',
        title: 'Zindan Efendisi'
    },
    child: {
        id: '/zindan-efendisi-bolum-1-oku/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 789_016,
        type: 'image/webp'
    }
}).AssertWebsite();
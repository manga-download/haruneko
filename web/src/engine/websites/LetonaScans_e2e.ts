import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'letonascans',
        title: 'Letona Scans'
    },
    container: {
        url: 'https://letonascans.com/manga/kocamdan-bosanamadim',
        id: 'kocamdan-bosanamadim',
        title: 'Kocamdan Boşanamadım'
    },
    child: {
        id: '/manga/kocamdan-bosanamadim/bolum/10',
        title: '10'
    },
    entry: {
        index: 0,
        size: 230_926,
        type: 'image/webp'
    }
}).AssertWebsite();
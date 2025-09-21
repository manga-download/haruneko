import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lethescans',
        title: 'Lethe Scans'
    },
    container: {
        url: 'https://www.lethescans.com/manga/l-a-g/',
        id: '/manga/l-a-g/',
        title: 'L.A.G'
    },
    child: {
        id: '/l-a-g-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 5,
        size: 633_568,
        type: 'image/webp'
    }
}).AssertWebsite();
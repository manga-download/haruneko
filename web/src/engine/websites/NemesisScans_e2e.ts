import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nemesisscans',
        title: 'Nemesis Scans'
    },
    container: {
        url: 'https://www.nemesisscans.com/manga/kusuriya-no-hitorigoto/',
        id: JSON.stringify({ post: '185', slug: '/manga/kusuriya-no-hitorigoto/'}),
        title: 'Kusuriya no Hitorigoto'
    },
    child: {
        id: '/manga/kusuriya-no-hitorigoto/bolum-81-2/',
        title: 'Bölüm 81.2'
    },
    entry: {
        index: 0,
        size: 374_708,
        type: 'image/webp'
    }
}).AssertWebsite();
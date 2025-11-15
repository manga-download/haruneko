import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'niverafansub',
        title: 'Nivera Fansub'
    },
    container: {
        url: 'https://niverafansub.org/manga/xian-chan-nu/',
        id: JSON.stringify({ post: '183', slug: '/manga/xian-chan-nu/' }),
        title: 'Xian Chan Nu'
    },
    child: {
        id: '/manga/xian-chan-nu/101-bolum/',
        title: '101. Bölüm'
    }, /* Need Login
    entry: {
        index: 1,
        size: 1_536_881,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'demonsect',
        title: 'Demon Sect',
    },
    container: {
        url: 'https://seitacelestial.com/manga/reencarnacao-maldita/',
        id: JSON.stringify({ post: '449', slug: '/manga/reencarnacao-maldita/' }),
        title: 'Reencarnação Maldita',
    },
    child: {
        id: '/manga/reencarnacao-maldita/cap-81/',
        title: 'Cap.81',
    },
    entry: {
        index: 1,
        size: 1_882_466,
        type: 'image/jpeg',
    }
}).AssertWebsite();
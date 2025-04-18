import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'domalfansub',
        title: 'Domal Fansub'
    },
    container: {
        url: 'https://d0malfansub.com.tr/manga/code-of-silence/',
        id: JSON.stringify({ post: '5675', slug: '/manga/code-of-silence/'}),
        title: 'Code of Silence'
    },
    child: {
        id: '/manga/code-of-silence/52-bolum/',
        title: '52. Bölüm'
    },
    entry: {
        index: 0,
        size: 959_821,
        type: 'image/jpeg'
    }
}).AssertWebsite();
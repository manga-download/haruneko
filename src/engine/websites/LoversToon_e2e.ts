import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'loverstoon',
        title: 'Lovers Toon',
    },
    container: {
        url: 'https://loverstoon.com/manga/a-vida-de-um-passarinho/',
        id: JSON.stringify({ post: '98', slug: '/manga/a-vida-de-um-passarinho/'}),
        title: 'A Vida de Um Passarinho',
    },
    child: {
        id: '/manga/a-vida-de-um-passarinho/cap-01/',
        title: 'Cap. 01',
    },
    entry: {
        index: 0,
        size: 798_366,
        type: 'image/jpeg'
    }
}).AssertWebsite();
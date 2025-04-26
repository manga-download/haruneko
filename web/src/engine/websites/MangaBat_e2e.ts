import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabat',
        title: 'MangaBat'
    },
    container: {
        url: 'https://www.mangabats.com/manga/the-devil-ring',
        id: '/manga/the-devil-ring',
        title: 'The Devil Ring',
    },
    child: {
        id: '/manga/the-devil-ring/chapter-162',
        title: 'Chapter 162'
    },
    entry: {
        index: 1,
        size: 100_618,
        type: 'image/webp'
    }
}).AssertWebsite();
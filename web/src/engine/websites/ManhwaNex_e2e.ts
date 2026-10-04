import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwanex',
        title: 'ManhwaNex',
    },
    container: {
        url: 'https://manhwanex.com/manga/infinite-evolution-from-zero/',
        id: JSON.stringify({ post: '625', slug: '/manga/infinite-evolution-from-zero/'}),
        title: 'Infinite Evolution From Zero'
    },
    child: {
        id: '/manga/infinite-evolution-from-zero/chapter-122/',
        title: 'Chapter 122'
    },
    entry: {
        index: 1,
        size: 122_396,
        type: 'image/webp'
    }
}).AssertWebsite();
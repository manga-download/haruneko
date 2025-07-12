import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yakshascans',
        title: 'YakshaScans'
    },
    container: {
        url: 'https://yakshascans.com/manga/ill-twist-the-neck-of-a-sweet-dog/',
        id: JSON.stringify({ post: '4956', slug: '/manga/ill-twist-the-neck-of-a-sweet-dog/' }),
        title: `I'll Twist the Neck of a Sweet Dog`
    },
    child: {
        id: '/manga/ill-twist-the-neck-of-a-sweet-dog/chapter-143/',
        title: 'Chapter 143'
    },
    entry: {
        index: 0,
        size: 317_652,
        type: 'image/jpeg',
    }
}).AssertWebsite();
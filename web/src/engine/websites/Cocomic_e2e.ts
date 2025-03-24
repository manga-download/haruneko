import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cocomic',
        title: 'Cocomic'
    },
    container: {
        url: 'https://cocomic.co/manga/do-you-need-salvation-official/',
        id: JSON.stringify({ post: '65060', slug: '/manga/do-you-need-salvation-official/' }),
        title: 'Do You Need Salvation? [Official]'
    },
    child: {
        id: '/manga/do-you-need-salvation-official/chapter-40/',
        title: 'Chapter 40'
    },
    entry: {
        index: 0,
        size: 52_680,
        type: 'image/webp'
    }
}).AssertWebsite();
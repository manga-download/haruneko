import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toonily',
        title: 'Toonily'
    },
    container: {
        url: 'https://toonily.com/serie/leviathan-0002/',
        id: JSON.stringify({ post: '1892', slug: '/serie/leviathan-0002/' }),
        title: 'Leviathan'
    },
    child: {
        id: '/serie/leviathan-0002/chapter-0/',
        title: 'Chapter 0 - Prologue'
    },
    entry: {
        index: 0,
        size: 506_036,
        type: 'image/webp'
    }
}).AssertWebsite();
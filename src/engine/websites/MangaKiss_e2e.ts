import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakiss',
        title: 'Mangakiss'
    },
    container: {
        url: 'https://mangakiss.org/manga/onesmorechanceso1/',
        id: JSON.stringify({ post: '52', slug: '/manga/onesmorechanceso1/' }),
        title: 'One More Chance For Love'
    },
    child: {
        id: '/manga/onesmorechanceso1/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 195_293,
        type: 'image/jpeg'
    }
}).AssertWebsite();
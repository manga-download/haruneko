import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'coffeemanga',
        title: 'CoffeeManga'
    },
    container: {
        url: 'https://coffeemanga.ink/manga/savage-castle-0/',
        id: JSON.stringify({ post: '23019', slug: '/manga/savage-castle-0/' }),
        title: 'Savage Castle'
    },
    child: {
        id: '/manga/savage-castle-0/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 119_934,
        type: 'image/webp'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: '24hnovel',
        title: '24hnovel'
    },
    container: {
        url: 'https://24hnovel.com/manga/super-gene/',
        id: JSON.stringify({ post: '368591', slug: '/manga/super-gene/' }),
        title: 'Super Gene'
    },
    child: {
        id: '/manga/super-gene/chapter-399/',
        title: 'Chapter 399 - The Phoenixon Emperor'
    },
    entry: {
        index: 1,
        size: 305_233,
        type: 'image/jpeg'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'likemanga',
        title: 'LikeManga'
    },
    container: {
        url: 'https://likemanga.in/manga/my-eternal-reign/',
        id: JSON.stringify({ post: '30075', slug: '/manga/my-eternal-reign/' }),
        title: 'My Eternal Reign'
    },
    child: {
        id: '/manga/my-eternal-reign/chapter-9/',
        title: 'Chapter 9'
    },
    entry: {
        index: 0,
        size: 515_036,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();

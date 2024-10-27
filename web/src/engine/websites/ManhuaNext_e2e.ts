import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuanext',
        title: 'ManhuaNext'
    },
    container: {
        url: 'https://manhuanext.com/manga/the-godslayer-who-cheats/',
        id: JSON.stringify({ post: '1918', slug: '/manga/the-godslayer-who-cheats/' }),
        title: 'The Godslayer Who Cheats'
    },
    child: {
        id: '/manga/the-godslayer-who-cheats/chapter-70/',
        title: 'Chapter 70'
    },
    entry: {
        index: 2,
        size: 116_854,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();
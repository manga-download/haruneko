import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhuanext',
        title: 'ManhuaNext'
    },
    container: {
        url: 'https://manhuanext.com/manga/please-slay-the-demon-young-master/',
        id: JSON.stringify({ post: '1961', slug: '/manga/please-slay-the-demon-young-master/' }),
        title: 'Please Slay The Demon! Young Master!'
    },
    child: {
        id: '/manga/please-slay-the-demon-young-master/chapter-149/',
        title: 'Chapter 149'
    },
    entry: {
        index: 0,
        size: 967_857,
        type: 'image/jpeg'
    }
}).AssertWebsite();
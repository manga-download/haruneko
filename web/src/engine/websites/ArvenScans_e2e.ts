import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arvenscans',
        title: 'Arven Scans'
    },
    container: {
        url: 'https://arvencomics.com/comic/the-only-one-with-level-down-the-strongest-awakened/',
        id: JSON.stringify({ post: '511', slug: '/comic/the-only-one-with-level-down-the-strongest-awakened/'}),
        title: 'The Only One with Level Down: The Strongest Awakened'
    },
    child: {
        id: '/comic/the-only-one-with-level-down-the-strongest-awakened/9/',
        title: '9'
    },
    entry: {
        index: 0,
        size: 699_255,
        type: 'image/jpeg'
    }
}).AssertWebsite();
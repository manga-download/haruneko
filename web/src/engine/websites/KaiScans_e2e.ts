import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kaiscans',
        title: 'Kai Scans'
    },
    container: {
        url: 'https://kaiscans.org/manga/the-princess-in-the-henhouse/',
        id: '/manga/the-princess-in-the-henhouse/',
        title: 'The Princess in The Henhouse',
    },
    child: {
        id: '/the-princess-in-the-henhouse-chapter-35/',
        title: 'Chapter 35'
    },
    entry: {
        index: 0,
        size: 87_049,
        type: 'image/jpeg'
    }
}).AssertWebsite();
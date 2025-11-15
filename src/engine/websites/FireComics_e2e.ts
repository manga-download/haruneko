import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'firecomics',
        title: 'FireComics'
    },
    container: {
        url: 'https://firescans.xyz/manga/i-became-the-target-of-the-harem-in-another-world/',
        id: JSON.stringify({ post: '488', slug: '/manga/i-became-the-target-of-the-harem-in-another-world/' }),
        title: 'I Became the Target of the Harem in Another World'
    },
    child: {
        id: '/manga/i-became-the-target-of-the-harem-in-another-world/chapter-13/',
        title: 'Chapter 13'
    },
    entry: {
        index: 0,
        size: 959_678,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webtoonxyz',
        title: 'WebtoonXYZ'
    },
    container: {
        url: 'https://www.webtoon.xyz/read/the-creator-is-on-hiatus/',
        id: JSON.stringify({ post: '10628', slug: '/read/the-creator-is-on-hiatus/' }),
        title: `I'll Be Taking A Break For Personal Reasons`
    },
    child: {
        id: '/read/the-creator-is-on-hiatus/chapter-81/',
        title: 'Chapter 81'
    },
    entry: {
        index: 0,
        size: 127_154,
        type: 'image/jpeg'
    }
}).AssertWebsite();
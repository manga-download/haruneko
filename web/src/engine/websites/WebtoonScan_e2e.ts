import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webtoonscan',
        title: 'WebtoonScan'
    },
    container: {
        url: 'https://webtoonscan.com/manhwa/my-gangster-girlfriend/',
        id: JSON.stringify({ post: '19435', slug: '/manhwa/my-gangster-girlfriend/' }),
        title: 'My Gangster Girlfriend'
    },
    child: {
        id: '/manhwa/my-gangster-girlfriend/chapter-13/',
        title: 'Chapter 13'
    },
    entry: {
        index: 0,
        size: 280_303,
        type: 'image/jpeg'
    }
}).AssertWebsite();
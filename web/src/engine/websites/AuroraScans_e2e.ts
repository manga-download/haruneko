import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aurorascans',
        title: 'Aurora Scans'
    },
    container: {
        url: 'https://aurorascans.com/series/youve-got-the-wrong-girl',
        id: '6',
        title: `You've Got the Wrong Girl`
    },
    child: {
        id: '/series/youve-got-the-wrong-girl/chapter-77',
        title: 'Chapter 77'
    },
    entry: {
        index: 7,
        size: 1_115_596,
        type: 'image/webp'
    }
}).AssertWebsite();
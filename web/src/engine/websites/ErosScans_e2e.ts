import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'erosscans',
        title: 'Eros Scans'
    },
    container: {
        url: 'https://erosxsun.xyz/manga/i-have-90-billion-licking-gold-coins/',
        id: '/manga/i-have-90-billion-licking-gold-coins/',
        title: 'I have 90 billion licking gold coins'
    },
    child: {
        id: '/i-have-90-billion-licking-gold-coins-chapter-500/',
        title: 'Chapter 500'
    },
    entry: {
        index: 0,
        size: 1_197_372,
        type: 'image/webp'
    }
}).AssertWebsite();
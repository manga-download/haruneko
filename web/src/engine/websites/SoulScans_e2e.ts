import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'soulscans',
        title: 'Soul Scans'
    },
    container: {
        url: 'https://v1.soulscans.org/comic/i-have-90-billion-licking-gold',
        id: 'i-have-90-billion-licking-gold',
        title: 'I Have 90 Billion Licking Gold'
    },
    child: {
        id: 'chapter-529',
        title: 'Chapter 529',
    },
    entry: {
        index: 0,
        size: 110_071,
        type: 'image/jpeg'
    }
}).AssertWebsite();
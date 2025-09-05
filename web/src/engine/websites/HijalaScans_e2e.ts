import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hijalascans',
        title: 'Hijala Scans'
    },
    container: {
        url: 'https://en-hijala.com/series/primitive-man-kim-dong-woo',
        id: '46',
        title: 'Primitive Man Kim Dong-Woo'
    },
    child: {
        id: '/series/primitive-man-kim-dong-woo/chapter-1',
        title: 'Chapter 1 - 1'
    },
    entry: {
        index: 14,
        size: 684_832,
        type: 'image/webp'
    }
}).AssertWebsite();
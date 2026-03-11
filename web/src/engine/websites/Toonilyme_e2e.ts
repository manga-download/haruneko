import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toonilyme',
        title: 'Toonily (.me)'
    },
    container: {
        url: 'https://toonily.me/solo-leveling',
        id: '/solo-leveling',
        title: 'Solo Leveling'
    },
    child: {
        id: '/solo-leveling/chapter-50',
        title: 'Chapter 50'
    },
    entry: {
        index: 0,
        size: 281_750,
        type: 'image/jpeg'
    }
}).AssertWebsite();
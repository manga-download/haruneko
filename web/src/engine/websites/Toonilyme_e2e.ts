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
        id: '/solo-leveling/side-story-21-the-end',
        title: 'Side Story 21 - The End'
    },
    entry: {
        index: 0,
        size: 862_108,
        type: 'image/jpeg'
    }
}).AssertWebsite();
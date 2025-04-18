import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'astrascans',
        title: 'AstraScans'
    },
    container: {
        url: 'https://astrascans.net/series/unstoppable-muscle-power/',
        id: '/series/unstoppable-muscle-power/',
        title: 'Unstoppable Muscle Power'
    },
    child: {
        id: '/unstoppable-muscle-power-chapter-23/',
        title: 'Chapter 23'
    },
    entry: {
        index: 0,
        size: 119_697,
        type: 'image/jpeg'
    }
}).AssertWebsite();
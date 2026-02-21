import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arcanescans',
        title: 'ArcaneScans'
    },
    container: {
        url: 'https://arcanescans.org/manga/celebrating-the-remaining-life/',
        id: '/manga/celebrating-the-remaining-life/',
        title: 'Celebrating the Remaining Life'
    },
    child: {
        id: '/celebrating-the-remaining-life-chapter-75/',
        title: 'Chapter 75'
    },
    entry: {
        index: 0,
        size: 55_487,
        type: 'image/jpeg'
    }
}).AssertWebsite();
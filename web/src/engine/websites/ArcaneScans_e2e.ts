import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arcanescans',
        title: 'ArcaneScans'
    },
    container: {
        url: 'https://arcanescans.com/manga/99-wooden-stick/',
        id: '/manga/99-wooden-stick/',
        title: 'Serving the Heavens is my Destiny'
    },
    child: {
        id: '/99-wooden-stick-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 298_021,
        type: 'image/jpeg'
    }
}).AssertWebsite();
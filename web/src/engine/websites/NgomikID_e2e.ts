import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ngomikid',
        title: 'Ngomik ID'
    },
    container: {
        url: 'https://ngomik.id/manga/the-player-hides-his-past/',
        id: '/manga/the-player-hides-his-past/',
        title: 'The Player Hides His Past'
    },
    child: {
        id: '/the-player-hides-his-past-chapter-60/',
        title: 'Chapter 60'
    },
    entry: {
        index: 1,
        size: 253_466,
        type: 'image/webp'
    }
}).AssertWebsite();
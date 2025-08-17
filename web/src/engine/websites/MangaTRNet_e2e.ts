import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatrnet',
        title: 'MangaTR (.Net)'
    },
    container: {
        url: 'https://mangatr.app/manga/sami-plays-the-game/',
        id: JSON.stringify({ post: '12358', slug: '/manga/sami-plays-the-game/' }),
        title: 'Sami Plays the Game'
    },
    child: {
        id: '/manga/sami-plays-the-game/bolum-44/',
        title: 'Bölüm 44'
    },
    entry: {
        index: 1,
        size: 173_218,
        type: 'image/webp'
    }
}).AssertWebsite();
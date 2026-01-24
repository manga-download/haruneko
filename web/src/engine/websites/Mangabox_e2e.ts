import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabox',
        title: 'Mangabox'
    },
    container: {
        url: 'https://www.mangabox.me/reader/220/episodes/',
        id: '220',
        title: 'オンライン The Comic'
    },
    child: {
        id: JSON.stringify({ episodeId: 5380, mask: 57 }),
        title: '1'
    },
    entry: {
        index: 0,
        size: 344_796,
        type: 'image/png'
    }
}).AssertWebsite();
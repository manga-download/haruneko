import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'mangahubfr',
        title: 'MangaHubFR'
    },
    container: {
        url: 'https://mangahub.fr/manga/keikakuteki-pavlov-maker/',
        id: JSON.stringify({ post: '61824', slug: '/manga/keikakuteki-pavlov-maker/' }),
        title: 'Keikakuteki Pavlov Maker'
    },
    child: {
        id: '/manga/keikakuteki-pavlov-maker/chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 1_483_210,
        type: 'image/png'
    }
}).AssertWebsite();
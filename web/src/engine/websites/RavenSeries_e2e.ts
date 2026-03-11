import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ravenseries',
        title: 'RavenSeries'
    },
    container: {
        url: 'https://ravensword.lat/sr2/la-personaje-de-webtoon',
        id: '/sr2/la-personaje-de-webtoon',
        title: 'La personaje de webtoon',
    },
    child: {
        id: '/hz2/la-personaje-de-webtoon/127',
        title: 'Capítulo 127',
    },
    entry: {
        index: 1,
        size: 545_398,
        type: 'image/jpeg'
    }
}).AssertWebsite();
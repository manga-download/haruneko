import { TestFixture } from '../../../test/WebsitesFixture';

const fixtureListViewWebtoon = new TestFixture({
    plugin: {
        id: 'hunterfansub',
        title: 'Hunter Fansub'
    },
    container: {
        url: 'https://hunterfansub.com/biblioteca/lector',
        id: JSON.stringify({ post: '398', slug: '/biblioteca/lector' }),
        title: 'Lector'
    },
    child: {
        id: '/biblioteca/lector/capitulo-01/',
        title: 'Capitulo 01'
    },
    entry: {
        index: 1,
        size: 865_126,
        type: 'image/jpeg'
    }
});
describe(fixtureListViewWebtoon.Name, () => fixtureListViewWebtoon.AssertWebsite());

const fixtureMultiPagedManga = new TestFixture({
    plugin: {
        id: 'hunterfansub',
        title: 'Hunter Fansub'
    },
    container: {
        url: 'https://hunterfansub.com/biblioteca/deadpool-samurai',
        id: JSON.stringify({ post: '1485', slug: '/biblioteca/deadpool-samurai' }),
        title: 'Deadpool Samurai'
    },
    child: {
        id: '/biblioteca/deadpool-samurai/2/capitulo-15-fin/',
        title: 'Capítulo 15 - Fin'
    },
    entry: {
        index: 1,
        size: 1_955_611,
        type: 'image/jpeg'
    }
});
describe(fixtureMultiPagedManga.Name, () => fixtureMultiPagedManga.AssertWebsite());
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatv',
        title: 'MangaTV'
    },
    container: {
        url: 'https://mangatv.net/manga/26483/higurashi-no-naku-koro-ni-sotsu-special-draw-comics',
        id: '/manga/26483/higurashi-no-naku-koro-ni-sotsu-special-draw-comics',
        title: 'Higurashi No Naku Koro Ni Sotsu Special Draw Comics'
    },
    child: {
        id: '/leer/ac98b8107dec49',
        title: 'Capítulo 1 Oniakashihen | Zona Hinamizawa'
    },
    entry: {
        index: 0,
        size: 381_285,
        type: 'image/jpeg'
    }
}).AssertWebsite();
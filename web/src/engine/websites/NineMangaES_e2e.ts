import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-es',
        title: 'NineMangaES'
    },
    container: {
        url: 'https://es.niadd.com/manga/Martial_Peak.html',
        id: '/manga/Martial_Peak.html',
        title: 'Martial Peak',
    },
    child: {
        id: '/chapter/Martial_Peak_Capitulo_3440/1855269/',
        title: 'Capitulo 3440',
    },
    entry: {
        index: 1,
        size: 110_242,
        type: 'image/webp'
    }
}).AssertWebsite();
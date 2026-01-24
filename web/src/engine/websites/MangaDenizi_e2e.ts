import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadenizi',
        title: 'Manga Denizi',
    },
    container: {
        url: 'https://www.mangadenizi.net/manga/yuragisou-no-yuunasan',
        id: '/manga/yuragisou-no-yuunasan',
        title: 'Yuragi-sou no Yuuna-san',
    },
    child: {
        id: '/manga/yuragisou-no-yuunasan/209',
        title: 'Bölüm 209: Yuuna [SON]',
    },
    entry: {
        index: 1,
        size: 230_076,
        type: 'image/webp',
    }
}).AssertWebsite();
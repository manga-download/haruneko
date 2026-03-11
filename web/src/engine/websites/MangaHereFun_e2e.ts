import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaherefun',
        title: 'MangaHereFun',
    },
    container: {
        url: 'https://mangahere.onl/manga/tensei-akujo-no-kuro-rekishi',
        id: 'tensei-akujo-no-kuro-rekishi',
        title: 'Tensei Akujo no Kuro Rekishi'
    },
    child: {
        id: '1',
        title: 'Ch.1 - Ch.001'
    },
    entry: {
        index: 1,
        size: 199_628,
        type: 'image/jpeg'
    }
}).AssertWebsite();
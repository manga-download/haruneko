import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaonlinefun',
        title: 'MangaOnlineFun',
    },
    container: {
        url: 'https://mangaonline.fun/manga/namaiki-asahi-chan-wo-wakarasetai',
        id: 'namaiki-asahi-chan-wo-wakarasetai',
        title: 'Namaiki Asahi-chan wo Wakarasetai'
    },
    child: {
        id: '1',
        title: 'Ch.1 - Vol.1 - Chapter 1'
    },
    entry: {
        index: 1,
        size: 966_497,
        type: 'image/jpeg'
    }
}).AssertWebsite();
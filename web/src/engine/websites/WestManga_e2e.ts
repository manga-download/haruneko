import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'westmanga',
        title: 'WestManga'
    },
    container: {
        url: 'https://westmanga.me/manga/henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-%e3%80%9caisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai%e3%80%9c/',
        id: '/manga/henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-%e3%80%9caisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai%e3%80%9c/',
        title: 'Henkyou Gurashi no Maou, Tensei Shite Saikyou no Majutsushi ni naru 〜Aisarenagara Nariagaru Moto Maō wa, Ningen o Shiritai〜'
    },
    child: {
        id: '/henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-%e3%80%9caisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai%e3%80%9c-chapter-1-1-bahasa-indonesia/',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 1,
        size: 141_906,
        type: 'image/jpeg'
    }
}).AssertWebsite();
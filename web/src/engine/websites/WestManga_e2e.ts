import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'westmanga',
        title: 'WestManga'
    },
    container: {
        url: 'https://westmanga.me/comic/henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-〜aisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai〜',
        id: 'henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-〜aisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai〜',
        title: 'Henkyou Gurashi no Maou, Tensei Shite Saikyou no Majutsushi ni naru 〜Aisarenagara Nariagaru Moto Maō wa, Ningen o Shiritai〜'
    },
    child: {
        id: 'henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-〜aisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai〜-chapter-1-1-bahasa-indonesia',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 1,
        size: 141_906,
        type: 'image/jpeg'
    }
}).AssertWebsite();
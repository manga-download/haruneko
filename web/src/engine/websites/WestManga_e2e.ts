import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'westmanga',
        title: 'WestManga'
    },
    container: {
        url: 'https://westmanga.fun/manga/henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-%e3%80%9caisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai%e3%80%9c/',
        id: '/manga/henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-%e3%80%9caisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai%e3%80%9c/',
        title: 'Henkyou Gurashi no Maou, Tensei Shite Saikyou no Majutsushi ni naru 〜Aisarenagara Nariagaru Moto Maō wa, Ningen o Shiritai〜'
    },
    child: {
        id: '/henkyou-gurashi-no-maou-tensei-shite-saikyou-no-majutsushi-ni-naru-%e3%80%9caisarenagara-nariagaru-moto-mao-wa-ningen-o-shiritai%e3%80%9c-chapter-1-1-bahasa-indonesia/',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 0,
        size: 90_536,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
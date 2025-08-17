import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'pixhentai',
        title: 'PixHentai'
    },
    container: {
        url: 'https://pixhentai.com/otou-san-yamete-ayah-tiri-baru-pilihan-ibu/',
        id: '/otou-san-yamete-ayah-tiri-baru-pilihan-ibu/',
        title: 'Otou-san Yamete : Ayah Tiri baru pilihan Ibu'
    },
    child: {
        id: '/otou-san-yamete-ayah-tiri-baru-pilihan-ibu/',
        title: 'Otou-san Yamete : Ayah Tiri baru pilihan Ibu'
    },
    entry: {
        index: 0,
        size: 40_712,
        type: 'image/webp'
    }
}).AssertWebsite();
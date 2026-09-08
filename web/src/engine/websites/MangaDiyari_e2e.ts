import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadiyari',
        title: 'MangaDiyari'
    },
    container: {
        url: 'https://mangadiyari.com/seri/dovus-sanatlarinin-zirvesi',
        id: '44',
        title: `Dövüş Sanatlarının Zirvesi`
    },
    child: {
        id: '6417',
        title: 'Bölüm 3851'
    },
    entry: {
        index: 4,
        size: 732_294,
        type: 'image/webp'
    }
}).AssertWebsite();
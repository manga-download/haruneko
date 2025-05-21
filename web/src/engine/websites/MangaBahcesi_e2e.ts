import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaship',
        title: 'Manga Ship'
    },
    container: {
        url: 'https://mangabahcesi.com/Tr/Manga/undead-unluck',
        id: '/Tr/Manga/undead-unluck',
        title: 'Ölümsüz ve Şanssız'
    },
    child: {
        id: '/Tr/Manga/undead-unluck/51',
        title: '51.Bölüm Kahraman'
    },
    /*
    entry: { //login needed
        index: 1,
        size: 847_092,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();
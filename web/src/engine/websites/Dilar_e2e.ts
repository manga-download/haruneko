import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dilar',
        title: 'Dilar'
    },
    container: {
        url: 'https://dilar.tube/mangas/11089/the-regressed-villainess-makes-a-vow-of-chastity',
        id: '11089',
        title: 'The Regressed Villainess Makes a Vow of Chastity'
    },
    child: {
        id: '4',
        title: '4 - الفصل 3'
    },
    entry: {
        index: 0,
        size: 1_534_726,
        type: 'image/jpeg'
    }
}).AssertWebsite();
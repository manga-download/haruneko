import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dilar',
        title: 'Dilar'
    },
    container: {
        url: 'https://v2.dilar.tube/series/11089/the-regressed-villainess-makes-a-vow-of-chastity',
        id: '11089',
        title: 'The Regressed Villainess Makes a Vow of Chastity'
    },
    child: {
        id: '127692',
        title: '1.00 [اوشن 🌊]'
    },
    entry: {
        index: 0,
        size: 587_035,
        type: 'image/jpeg'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ainzscans',
        title: 'Ainzscans'
    },
    container: {
        url: 'https://ainzscans01.com/series/disastrous-necromancer/',
        id: '/series/disastrous-necromancer/',
        title: 'Disastrous Necromancer'
    },
    child: {
        id: '/disastrous-necromancer-chapter-37-bahasa-indonesia/',
        title: 'Chapter 37'
    },
    entry: {
        index: 2,
        size: 995_872,
        type: 'image/jpeg'
    }
}).AssertWebsite();
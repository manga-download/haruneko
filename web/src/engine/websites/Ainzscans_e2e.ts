import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ainzscans',
        title: 'Ainzscans'
    },
    container: {
        url: 'https://v1.ainzscans01.com/comic/disastrous-necromancer',
        id: 'disastrous-necromancer',
        title: 'Disastrous Necromancer'
    },
    child: {
        id: 'chapter-37-bahasa-indonesia',
        title: 'Chapter 37'
    },
    entry: {
        index: 2,
        size: 109_219,
        type: 'image/jpeg'
    }
}).AssertWebsite();
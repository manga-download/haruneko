import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatek',
        title: 'MangaTek'
    },
    container: {
        url: 'https://mangatek.com/manga/pick-me-up',
        id: '/manga/pick-me-up',
        title: 'Pick Me Up!'
    },
    child: {
        id: '/reader/pick-me-up/165',
        title: 'Chapter 165'
    },
    entry: {
        index: 0,
        size: 583_476,
        type: 'image/jpeg'
    }
}).AssertWebsite();
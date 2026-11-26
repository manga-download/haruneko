import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'alphamanga',
        title: 'Alpha Manga'
    },
    container: {
        url: 'https://www.alpha-manga.com/manga/119000129',
        id: '119000129',
        title: 'A Diary of Our Leisurely VRMMO Playthrough',
    },
    child: {
        id: '31',
        title: 'Chapter 1: I Started Playing a VRMOO'
    },
    entry: {
        index: 0,
        size: 414_877,
        type: 'image/png'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ezmanga',
        title: 'EZManga'
    },
    container: {
        url: `https://ezmanga.org/series/the-villain's-pure-love`,
        id: `the-villain's-pure-love`,
        title: `The Villain's Pure Love`
    },
    child: {
        id: 'chapter-42',
        title: 'Chapter 42'
    },
    entry: {
        index: 1,
        size: 288_088,
        type: 'image/webp'
    }
}).AssertWebsite();
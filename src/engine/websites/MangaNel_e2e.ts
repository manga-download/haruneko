import { TestFixture } from '../../../test/WebsitesFixture';

const fixtureSameSite = new TestFixture({
    plugin: {
        id: 'manganel',
        title: 'Manganato'
    },
    container: {
        url: 'https://manganato.com/manga-nh990564',
        id: '/manga-nh990564',
        title: 'Sweet Taboo'
    },
    child: {
        id: 'https://readmanganato.com/manga-nh990564/chapter-1',
        title: 'Chapter 1: Father-Daughter Standoff'
    },
    entry: {
        index: 0,
        size: 364_983,
        type: 'image/jpeg'
    }
});
describe(fixtureSameSite.Name, () => fixtureSameSite.AssertWebsite());

const fixtureCrossSite = new TestFixture({
    plugin: {
        id: 'manganel',
        title: 'Manganato'
    },
    container: {
        url: 'https://readmanganato.com/manga-mx989932',
        id: 'https://readmanganato.com/manga-mx989932',
        title: 'Keep A Low Profile, Sect Leader!'
    },
    child: {
        id: 'https://readmanganato.com/manga-mx989932/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 94_319,
        type: 'image/jpeg'
    }
});
describe(fixtureCrossSite.Name, () => fixtureCrossSite.AssertWebsite());
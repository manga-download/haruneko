import { TestFixture } from '../../../test/WebsitesFixture';

const fixtureWithoutLanguage = new TestFixture({
    plugin: {
        id: 'mangawindow',
        title: 'MangaWindow (by AnyACG)'
    },
    container: {
        url: 'https://mangawindow.net/series/105860/your-talent-is-mine',
        id: '/series/105860/your-talent-is-mine',
        title: 'Your Talent is Mine'
    },
    child: {
        id: '/chapter/1959345',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 126_808,
        type: 'image/webp'
    }
});
describe(fixtureWithoutLanguage.Name, () => fixtureWithoutLanguage.AssertWebsite());

const fixtureWithLanguage = new TestFixture({
    plugin: {
        id: 'mangawindow',
        title: 'MangaWindow (by AnyACG)'
    },
    container: {
        url: 'https://mangawindow.net/series/102127/wind-breaker',
        id: '/series/102127/wind-breaker',
        title: 'Wind Breaker [hu]'
    },
    child: {
        id: '/chapter/1901476',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 62_432,
        type: 'image/webp'
    }
});
describe(fixtureWithLanguage.Name, () => fixtureWithLanguage.AssertWebsite());
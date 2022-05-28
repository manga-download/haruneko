import { TestFixture } from '../../../test/WebsitesFixture';

const fixtureWithoutLanguage = new TestFixture({
    plugin: {
        id: 'batoto',
        title: 'Batoto (by AnyACG)'
    },
    // CloudFlare challenge... cannot be bypassed yet with puppeteer
    /*
    container: {
        url: 'https://bato.to/series/105860/your-talent-is-mine',
        id: '/series/105860/your-talent-is-mine',
        title: 'Your Talent is Mine'
    },
    child: {
        id: '/chapter/1959345',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 285_368,
        type: 'image/jpeg'
    }
    */
});
describe(fixtureWithoutLanguage.Name, () => fixtureWithoutLanguage.AssertWebsite());

const fixtureWithLanguage = new TestFixture({
    plugin: {
        id: 'batoto',
        title: 'Batoto (by AnyACG)'
    },
    // CloudFlare challenge... cannot be bypassed yet with puppeteer
    /*
    container: {
        url: 'https://bato.to/series/102127/wind-breaker',
        id: '/series/102127/wind-breaker',
        title: 'Wind Breaker [hu]'
    },
    child: {
        id: '/chapter/1901476',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 160_214,
        type: 'image/jpeg'
    }
    */
});
describe(fixtureWithLanguage.Name, () => fixtureWithLanguage.AssertWebsite());
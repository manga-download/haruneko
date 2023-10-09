import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangahasu',
        title: 'MangaHasu'
    },
    container: {
        url: 'https://mangahasu.se/a-returners-magic-should-be-special-oorLmLZmyBZZ-p33524.html',
        id: '/a-returners-magic-should-be-special-oorLmLZmyBZZ-p33524.html',
        title: `A Returner's Magic Should Be Special`
    },
    child: {
        id: '/a-returners-magic-should-be-special/chapter-238-oorLmLZmyBZZ-c1894439.html',
        title: 'Chapter 238'
    },
    entry: {
        index: 0,
        size: 711_638,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
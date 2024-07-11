import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangahasu',
        title: 'MangaHasu'
    },
    container: {
        url: 'https://mangahasu.me/a-returners-magic-should-be-special-oorLmLZmyBZZ-p33524.html',
        id: '/a-returners-magic-should-be-special-oorLmLZmyBZZ-p33524.html',
        title: `A Returner's Magic Should Be Special`
    },
    child: {
        id: '/a-returners-magic-should-be-special/chapter-1-oorararaNEZZ-c629354.html',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 50_414,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
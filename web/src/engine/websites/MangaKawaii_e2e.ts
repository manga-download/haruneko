import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangakawaii',
        title: 'MangaKawaii',
    },
    container: {
        url: 'https://www.mangakawaii.io/manga/the-strongest-god-king',
        id: '/manga/the-strongest-god-king',
        title: 'The Strongest God King',
        timeout: 15000

    },
    child: {
        id: '/manga/the-strongest-god-king/en/331',
        title: 'Chapter 331 [en]'
    },
    entry: {
        index: 0,
        size: 129_069,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
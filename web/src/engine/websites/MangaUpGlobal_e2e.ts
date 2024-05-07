import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaupglobal',
        title: 'MangaUp (Global)'
    },
    container: {
        url: 'https://global.manga-up.com/manga/86',
        id: '86',
        title: 'A Dating Sim of Life or Death',
        timeout: 10000
    },
    child: {
        id: '6285',
        title: 'Chapter 1.1',
    },
    entry: {
        index: 0,
        size: 164_230,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
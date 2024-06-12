import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadig',
        title: 'MangaDig'
    },
    container: {
        url: 'https://mangadig.com/manga-wa912941/',
        id: '/manga-wa912941/',
        title: `The Duke's Teddy Bear`
    },
    child: {
        id: '/manga-wa912941/1/65.html',
        title: '(S2) Episode 65'
    },
    entry: {
        index: 0,
        size: 72_865,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
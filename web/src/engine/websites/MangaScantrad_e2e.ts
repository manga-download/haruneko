import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga-scantrad',
        title: 'Manga-Scantrad'
    },
    /* CloudFlare
    container: {
        url: 'https://manga-scantrad.io/manga/martial-peak/',
        id: JSON.stringify({ post: '3280', slug: '/manga/martial-peak/' }),
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/martial-peak/chapitre-1321/',
        title: 'Chapter 1321'
    },
    entry: {
        index: 2,
        size: 446_328,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
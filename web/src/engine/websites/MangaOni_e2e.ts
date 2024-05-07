import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaoni',
        title: 'MangaOni'
    },
    container: {
        url: 'https://manga-oni.com/manga/one-piece/',
        id: '/manga/one-piece/',
        title: 'One Piece'
    },
    /* Chapters are behind cloudflare
    child: {
        id: '/lector/one-piece/334745/',
        title: 'Capítulo 1100'
    },
    entry: {
        index: 0,
        size: 191_896,
        type: 'image/webp'
    }*/
};
const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
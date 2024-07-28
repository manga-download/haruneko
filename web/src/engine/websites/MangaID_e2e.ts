import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaid',
        title: 'MangaID'
    },
    container: {
        url: 'https://mangaid.cc/manga/saya-menjadi-penjahatnya/',
        id: JSON.stringify({ post: '2311', slug: '/manga/saya-menjadi-penjahatnya/' }),
        title: 'Saya menjadi penjahatnya'
    },
    child: {
        id: '/manga/saya-menjadi-penjahatnya/chapter-05/',
        title: 'Chapter-05'
    },
    entry: {
        index: 1,
        size: 106_062,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
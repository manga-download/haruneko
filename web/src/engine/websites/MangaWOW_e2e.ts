import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangawow',
        title: 'MangaWOW'
    },
    container: {
        url: 'https://mangawow.org/manga/path-of-the-shaman/',
        id: JSON.stringify({ post: '7521', slug: '/manga/path-of-the-shaman/' }),
        title: 'Şamanın Yolu'
    },
    child: {
        id: '/manga/path-of-the-shaman/bolum-01/',
        title: 'Bölüm 01'
    },
    entry: {
        index: 1,
        size: 800_462,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
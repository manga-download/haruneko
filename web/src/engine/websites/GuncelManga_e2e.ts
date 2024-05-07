import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'guncelmanga',
        title: 'Güncel Manga'
    },
    container: {
        url: 'https://guncelmanga.net/manga/the-promised-queen/',
        id: JSON.stringify({ post: '11215', slug: '/manga/the-promised-queen/' }),
        title: 'The Promised Queen'
    },
    child: {
        id: '/manga/the-promised-queen/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 5_815_034,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadiyari',
        title: 'MangaDiyari'
    },
    container: {
        url: 'https://manga-diyari.com/manga/1-nen-a-gumi-no-monster/',
        id: JSON.stringify({ post: '43', slug: '/manga/1-nen-a-gumi-no-monster/' }),
        title: '1 Nen A Gumi No Monster'
    },
    child: {
        id: '/manga/1-nen-a-gumi-no-monster/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 366_444,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
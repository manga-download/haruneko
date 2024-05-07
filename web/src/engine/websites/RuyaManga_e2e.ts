import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ruyamanga',
        title: 'Rüya Manga'
    },
    /* CloudFlare
    container: {
        url: 'https://www.ruyamanga.com/manga/deli-muhendis/',
        id: JSON.stringify({ post: '124522', slug: '/manga/deli-muhendis/' }),
        title: 'Deli Mühendis'
    },
    child: {
        id: '/manga/deli-muhendis/bolum-118/',
        title: 'Bölüm 118'
    },
    entry: {
        index: 0,
        size: 51_272,
        type: 'image/webp'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
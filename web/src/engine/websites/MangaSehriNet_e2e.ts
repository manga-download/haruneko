import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasehrinet',
        title: 'Manga Şehri (.NET)'
    },
    container: {
        url: 'https://mangasehri.net/manga/oshi-no-ko/',
        id: JSON.stringify({ post: '1133', slug: '/manga/oshi-no-ko/' }),
        title: 'Oshi no Ko'
    },
    child: {
        id: '/manga/oshi-no-ko/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 503_801,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tonizutoon',
        title: 'Tonizu Toon'
    },
    /* Login required :/
    container: {
        url: 'https://tonizu.xyz/manga/kullerin-imparatoricesi/',
        id: JSON.stringify({ post: '2387', slug: '/manga/kullerin-imparatoricesi/' }),
        title: 'Küllerin İmparatoriçesi'
    },
    child: {
        id: '/manga/kullerin-imparatoricesi/bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 0,
        size: 173_580,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
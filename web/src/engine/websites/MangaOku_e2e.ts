import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaoku',
        title: 'MangaOku'
    },
    container: {
        url: 'https://mangaoku.info/seri/wind-breaker/',
        id: JSON.stringify({ post: '293', slug: '/seri/wind-breaker/' }),
        title: 'Wind Breaker'
    },
    child: {
        id: '/seri/wind-breaker/bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 1,
        size: 42_845,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'grimelek',
        title: 'Grimelek'
    },
    /* NEED LOGIN FOR EVERYTHING
    container: {
        url: 'https://grimelek.me/seri/revenge-by-harem/',
        id: JSON.stringify({ slug: '/seri/revenge-by-harem/' }),
        title: 'Revenge By Harem'
    },
    child: {
        id: '/seri/revenge-by-harem/bolum-13/',
        title: 'Bölüm 13'
    },
    entry: {
        index: 1,
        size: 2_567_425,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
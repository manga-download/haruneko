import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'anisamanga',
        title: 'Anisa manga'
    },
    container: {
        url: 'https://anisamanga.com/manga/pumpkin-night/',
        id: JSON.stringify({ post: '469', slug: '/manga/pumpkin-night/' }),
        title: 'Pumpkin Night'
    },
    child: {
        id: '/manga/pumpkin-night/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 504_475,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
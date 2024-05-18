import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'jiangzaiToon',
        title: 'JiangzaiToon'
    },
    container: {
        url: 'https://jiangzaitoon.dev/manga/ani/',
        id: JSON.stringify({ post: '7208', slug: '/manga/ani/' }),
        title: 'Beyond the Memories'
    },
    child: {
        id: '/manga/ani/bolum-14/',
        title: 'Bölüm 14'
    },
    entry: {
        index: 1,
        size: 2_153_193,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
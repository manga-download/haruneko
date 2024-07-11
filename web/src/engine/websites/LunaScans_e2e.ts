import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lunascans',
        title: 'Luna Scans'
    },
    container: {
        url: 'https://lunascans.fun/manga/yilan-ve-serce/',
        id: JSON.stringify({ post: '4725', slug: '/manga/yilan-ve-serce/' }),
        title: 'Suzuhebi Kyuuairon'
    },
    child: {
        id: '/manga/yilan-ve-serce/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 293_183,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());

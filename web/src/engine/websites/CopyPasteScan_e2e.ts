import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'copypastescan',
        title: 'Copy & Paste Scan'
    },
    container: {
        url: 'https://copypastescan.xyz/manga/el-novato-invicto/',
        id: JSON.stringify({ post: '807', slug: '/manga/el-novato-invicto/' }),
        title: 'El Novato Invicto'
    },
    child: {
        id: '/manga/el-novato-invicto/capitulo-1',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 330_188,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
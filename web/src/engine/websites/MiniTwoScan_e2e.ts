import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'minitwoscan',
        title: 'MiniTwo Scan'
    },
    container: {
        url: 'https://minitwoscan.com/manga/boku-no-kokoro-no-yaibai-yatsu/',
        id: JSON.stringify({ post: '8344', slug: '/manga/boku-no-kokoro-no-yaibai-yatsu/' }),
        title: 'Boku no Kokoro no Yaibai yatsu'
    },
    child: {
        id: '/manga/boku-no-kokoro-no-yaibai-yatsu/capitulo-101/',
        title: 'Capítulo 101'
    },
    entry: {
        index: 1,
        size: 535_737,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'illusionscan',
        title: 'Illusion Scan'
    },
    container: {
        url: 'https://illusionscan.com/manga/hitorijime-my-hero-_/',
        id: JSON.stringify({ post: '2092', slug: '/manga/hitorijime-my-hero-_/' }),
        title: 'Hitorijime My Hero'
    },
    child: {
        id: '/manga/hitorijime-my-hero-_/capitulo-12-5/',
        title: 'Capítulo 12.5'
    },
    entry: {
        index: 2,
        size: 693_516,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
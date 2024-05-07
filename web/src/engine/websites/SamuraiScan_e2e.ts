import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'samuraiscan',
        title: 'Samurai Scan'
    },
    container: {
        url: 'https://samuraiscan.com/leer/star-martial-god-technique/',
        id: JSON.stringify({ post: '126', slug: '/leer/star-martial-god-technique/' }),
        title: 'Star Martial God Technique'
    },
    child: {
        id: '/leer/star-martial-god-technique/capitulo-1/',
        title: 'Capitulo 1',
    },
    entry: {
        index: 0,
        size: 85_402,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
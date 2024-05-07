import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fayscans',
        title: 'Fay Scans'
    },
    container: {
        url: 'https://fayscans.net/manga/i-trying-to-be-a-loyal-sword/',
        id: JSON.stringify({ post: '99', slug: '/manga/i-trying-to-be-a-loyal-sword/' }),
        title: 'I Tried To Be Your Loyal Sword'
    },
    child: {
        id: '/manga/i-trying-to-be-a-loyal-sword/capitulo-54/',
        title: 'Capítulo 54'
    },
    entry: {
        index: 2,
        size: 1_336_579,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
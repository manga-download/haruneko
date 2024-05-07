import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tatakaescan',
        title: 'Tatakae Scan'
    },
    container: {
        url: 'https://tatakaescan.com/manga/martial-inverse/',
        id: JSON.stringify({ post: '50', slug: '/manga/martial-inverse/' }),
        title: 'Martial Inverse'
    },
    child: {
        id: '/manga/martial-inverse/capitulo-00/',
        title: 'Capítulo 00'
    },
    entry: {
        index: 0,
        size: 958_350,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
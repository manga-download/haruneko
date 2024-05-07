import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'frtiretscan',
        title: 'FR-Scan'
    },
    container: {
        url: 'https://fr-scan.com/manga/blue-lock/',
        id: JSON.stringify({ post: '1903', slug: '/manga/blue-lock/' }),
        title: 'Blue Lock'
    },
    child: {
        id: '/manga/blue-lock/chapitre-248-vf/',
        title: 'Chapitre 248'
    },
    entry: {
        index: 1,
        size: 1_271_307,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
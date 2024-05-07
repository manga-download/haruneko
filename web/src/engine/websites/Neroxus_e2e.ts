import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'neroxus',
        title: 'Neroxus'
    },
    container: {
        url: 'https://neroxus.com.br/manga/the-mad-gate/',
        id: JSON.stringify({ post: '2436', slug: '/manga/the-mad-gate/' }),
        title: 'The Mad Gate'
    },
    child: {
        id: '/manga/the-mad-gate/02-guardiao/',
        title: '02 - Guardião'
    },
    entry: {
        index: 0,
        size: 3_513_948,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
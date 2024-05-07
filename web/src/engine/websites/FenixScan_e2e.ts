import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fenixscan',
        title: 'Manga Fenix'
    },
    container: {
        url: 'https://manga-fenix.com/manga/the-supreme-system/',
        id: JSON.stringify({ post: '3122', slug: '/manga/the-supreme-system/' }),
        title: 'The Supreme System'
    },
    child: {
        id: '/manga/the-supreme-system/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 146_873,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
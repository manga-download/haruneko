import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentai20',
        title: 'Hentai20'
    },
    container: {
        url: 'https://hentai20.io/manga/busted-by-my-co-worker-1000/',
        id: '/manga/busted-by-my-co-worker-1000/',
        title: '#Busted by my Co-Worker'
    },
    child: {
        id: '/busted-by-my-co-worker-1000-chapter-18/',
        title: 'Chapter 18'
    },
    entry: {
        index: 0,
        size: 23_044,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
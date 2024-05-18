import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'siimanga',
        title: 'SiiManga'
    },
    container: {
        url: 'https://siimanga.cyou/manga/overlord-of-insects/',
        id: JSON.stringify({ post: '367', slug: '/manga/overlord-of-insects/' }),
        title: 'Overlord of Insects'
    },
    child: {
        id: '/manga/overlord-of-insects/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 138_898,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
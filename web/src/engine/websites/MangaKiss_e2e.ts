import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangakiss',
        title: 'Mangakiss'
    },
    container: {
        url: 'https://mangakiss.org/manga/one-more-chance-for-love/',
        id: JSON.stringify({ post: '52', slug: '/manga/one-more-chance-for-love/' }),
        title: 'One More Chance For Love'
    },
    child: {
        id: '/manga/one-more-chance-for-love/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 195_293,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dianxiatrads',
        title: 'Dianxia Traduções'
    },
    container: {
        url: 'https://dianxiatrads.com/manga/lovely-allergen/',
        id: JSON.stringify({ post: '1790', slug: '/manga/lovely-allergen/' }),
        title: 'Lovely Allergen'
    },
    child: {
        id: '/manga/lovely-allergen/5/',
        title: '5 - O segredo está exposto!'
    },
    entry: {
        index: 0,
        size: 498_198,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gatemanga',
        title: 'GateManga'
    },
    container: {
        url: 'https://gatemanga.com/ar/kimetsu-no-yaiba-ar/',
        id: JSON.stringify({ post: '1936', slug: '/ar/kimetsu-no-yaiba-ar/' }),
        title: 'Kimetsu No Yaiba'
    },
    child: {
        id: encodeURI('/ar/kimetsu-no-yaiba-ar/الفصل-1-قسوة/').toLowerCase(),
        title: 'الفصل 1 : قسوة'
    },
    entry: {
        index: 0,
        size: 210_418,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
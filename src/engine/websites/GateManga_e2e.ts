import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gateanimemanga',
        title: 'GateManga'
    },
    container: {
        url: 'https://gatemanga.com/ar/kimetsu-no-yaiba/',
        id: JSON.stringify({ post: '1936', slug: '/ar/kimetsu-no-yaiba/' }),
        title: 'Kimetsu No Yaiba'
    },
    child: {
        id: encodeURI('/ar/kimetsu-no-yaiba/الفصل-1-قسوة/').toLowerCase(),
        title: 'الفصل 1 : قسوة'
    },
    entry: {
        index: 0,
        size: 457_686,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
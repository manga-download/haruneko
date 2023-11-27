import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kumotran',
        title: 'KumoTran'
    },
    container: {
        url: 'https://www.kumotran.com/manga/only-realized-after-losing-you/',
        id: JSON.stringify({ post: '199232', slug: '/manga/only-realized-after-losing-you/' }),
        title: 'Only Realized After Losing You'
    },
    child: {
        id: '/manga/only-realized-after-losing-you/48/',
        title: 'ตอนที่ 48'
    },
    entry: {
        index: 0,
        size: 160_823,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
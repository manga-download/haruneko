import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kumotran',
        title: 'KumoTran'
    },
    container: {
        url: 'https://www.kumotran.com/manga/little-hands/',
        id: JSON.stringify({ post: '119579', slug: '/manga/little-hands/' }),
        title: 'Little Hands'
    },
    child: {
        id: '/manga/little-hands/1.1/',
        title: 'ตอนที่ 1.1'
    },
    entry: {
        index: 0,
        size: 290_861,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
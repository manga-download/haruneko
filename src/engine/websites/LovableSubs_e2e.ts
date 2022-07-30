import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lovablesubs',
        title: 'lovablesubs'
    },
    container: {
        url: 'https://lovablesubs.com/seriler/oddeye/',
        id: JSON.stringify({ post: '1981', slug: '/seriler/oddeye/' }),
        title: 'Oddeye'
    },
    child: {
        id: '/seriler/oddeye/0-bolum/',
        title: '0. Bölüm'
    },
    entry: {
        index: 0,
        size: 529_570,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
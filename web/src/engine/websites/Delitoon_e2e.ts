import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'delitoon',
        title: 'Delitoon'
    },
    container: {
        url: 'https://www.delitoon.com/detail/daf_4100032',
        id: 'daf_4100032',
        title: 'À mon premier amour'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 47_192,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
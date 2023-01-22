import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'diamondfansub',
        title: 'DiamondFansub'
    },
    container: {
        url: 'https://diamondfansub.com/manga/gizli-azize/',
        id: JSON.stringify({ post: '997', slug: '/manga/gizli-azize/' }),
        title: 'Gizli Azize'
    },
    child: {
        id: '/manga/gizli-azize/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 1_876_218,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
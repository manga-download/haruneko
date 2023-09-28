import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ragnarokscan',
        title: 'RagnarokScan'
    },
    container: {
        url: 'https://ragnarokscan.com/series/i-will-become-an-immortal/',
        id: JSON.stringify({ post: '72', slug: '/series/i-will-become-an-immortal/' }),
        title: 'Cultivo Mortal: Me Convertiré En Un Inmortal'
    },
    child: {
        id: '/series/i-will-become-an-immortal/capitulo-0/',
        title: 'Capitulo 0'
    },
    entry: {
        index: 1,
        size: 394_570,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
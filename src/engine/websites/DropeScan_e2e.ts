import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'dropescan',
        title: 'Drope Scan'
    },
    container: {
        url: 'https://dropescan.com/manga/peerles-dad/',
        id: JSON.stringify({ post: '2777', slug: '/manga/peerles-dad/' }),
        title: 'Peerless Dad'
    },
    child: {
        id: '/manga/peerles-dad/volume-01/00-capitulo-00/',
        title: '00 - Capítulo 00'
    },
    entry: {
        index: 0,
        size: 372_255,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
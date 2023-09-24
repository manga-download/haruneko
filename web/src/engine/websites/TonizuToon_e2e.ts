import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tonizutoon',
        title: 'Tonizu Toon'
    },
    container: {
        url: 'https://tonizutoon.com/manga/empress-of-the-ashes1/',
        id: JSON.stringify({ post: '2387', slug: '/manga/empress-of-the-ashes1/' }),
        title: 'Küllerin İmparatoriçesi'
    },
    child: {
        id: '/manga/empress-of-the-ashes1/bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 0,
        size: 632_395,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
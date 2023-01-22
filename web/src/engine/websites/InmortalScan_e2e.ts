import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'inmortalscan',
        title: 'Inmortal Scan'
    },
    container: {
        url: 'https://manga.mundodrama.site/manga/king-of-the-octagon/',
        id: JSON.stringify({ post: '2047', slug: '/manga/king-of-the-octagon/' }),
        title: 'King of the Octagon'
    },
    child: {
        id: '/manga/king-of-the-octagon/capitulo-1/',
        title: 'capitulo 1'
    },
    entry: {
        index: 0,
        size: 542_106,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sdlscans',
        title: 'SDL Scans'
    },
    container: {
        url: 'https://sdlscans.com/manga/permitele-aterrizar/',
        id: JSON.stringify({ post: '1089', slug: '/manga/permitele-aterrizar/'}),
        title: 'Permitele Aterrizar'
    },
    child: {
        id: '/manga/permitele-aterrizar/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 1,
        size: 1_982_850,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
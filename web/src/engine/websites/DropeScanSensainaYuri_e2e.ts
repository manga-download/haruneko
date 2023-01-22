import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sensainayuri',
        title: 'Sensaina Yuri (Drope Scan)'
    },
    container: {
        url: 'https://sensainayuri.dropescan.com/manga/hidden/',
        id: JSON.stringify({ post: '3889', slug: '/manga/hidden/' }),
        title: 'Hidden'
    },
    child: {
        id: '/manga/hidden/01/',
        title: '01 - Parte 01'
    },
    entry: {
        index: 0,
        size: 3_301_358,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'maidscan',
        title: 'Maid Scan'
    },
    container: {
        url: 'https://maidscan.com.br/manga/avatar-o-ultimo-mestre-do-ar/',
        id: JSON.stringify({ post: '3965', slug: '/manga/avatar-o-ultimo-mestre-do-ar/'}),
        title: 'Avatar: O Último Mestre do Ar'
    },
    child: {
        id: '/manga/avatar-o-ultimo-mestre-do-ar/capitulo-03/',
        title: 'Capítulo 03'
    },
    entry: {
        index: 0,
        size: 977_493,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
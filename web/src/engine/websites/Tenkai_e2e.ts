import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tenkai',
        title: 'Tenkai'
    },
    container: {
        url: 'https://tenkaiscan.net/comics/cafeina',
        id: '/comics/cafeina',
        title: 'Cafeina'
    },
    child: {
        id: '/comics/cafeina/capitulo-01',
        title: 'Cápitulo 01'
    },
    entry: {
        index: 0,
        size: 164_168,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();
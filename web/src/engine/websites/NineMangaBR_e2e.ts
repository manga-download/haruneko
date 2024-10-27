import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ninemanga-br',
        title: 'NineMangaBR'
    },
    container: {
        url: 'https://br.ninemanga.com/manga/Kingdom.html',
        id: '/manga/Kingdom.html',
        title: 'Kingdom',
    },
    child: {
        id: '/chapter/Kingdom/6718490.html',
        title: '762',
        timeout: 10000
    },
    entry: {
        index: 2,
        size: 306_842,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();
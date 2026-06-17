import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-br',
        title: 'NineMangaBR'
    },
    container: {
        url: 'https://br.niadd.com/manga/Kingdom.html',
        id: '/manga/Kingdom.html',
        title: 'Kingdom',
    },
    child: {
        id: '/chapter/Kingdom_762/6718490/',
        title: '762',
    },
    entry: {
        index: 2,
        size: 306_842,
        type: 'image/webp'
    }
}).AssertWebsite();
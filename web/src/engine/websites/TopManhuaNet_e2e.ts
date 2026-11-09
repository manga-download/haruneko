import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'topmanhuanet',
        title: 'Top ManhuaNET'
    },
    container: {
        url: 'https://topmanhua.net/manga/murim-login/',
        id: JSON.stringify({ post: '3818', slug: '/manga/murim-login/' }),
        title: 'Murim Login'
    },
    child: {
        id: '/manga/murim-login/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 295_538,
        type: 'image/webp'
    }
}).AssertWebsite();
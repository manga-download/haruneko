import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tiamanhwa',
        title: 'TiaManhwa',
    },
    container: {
        url: 'https://tiamanhwa.com/manhwa/taming-the-new-noona/',
        id: JSON.stringify({ post: '15427', slug: '/manhwa/taming-the-new-noona/' }),
        title: 'Taming the New Noona',
    },
    child: {
        id: '/manhwa/taming-the-new-noona/capitulo-13/',
        title: 'Capítulo 13',
    },
    entry: {
        index: 1,
        size: 444_204,
        type: 'image/webp',
    },
}).AssertWebsite();
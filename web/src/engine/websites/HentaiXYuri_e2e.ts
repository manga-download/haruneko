import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaixyuri',
        title: 'HentaiXYuri'
    },
    container: {
        url: 'https://hentaixyuri.com/manga/mugi-to-azu-kouhen-k-on/',
        id: JSON.stringify({ post: '4059', slug: '/manga/mugi-to-azu-kouhen-k-on/' }),
        title: 'Mugi to Azu Kouhen (K-On!)'
    },
    child: {
        id: '/manga/mugi-to-azu-kouhen-k-on/oneshot/',
        title: 'Oneshot'
    },
    entry: {
        index: 0,
        size: 141_572,
        type: 'image/webp'
    }
}).AssertWebsite();
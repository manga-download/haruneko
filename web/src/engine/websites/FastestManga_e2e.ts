import { TestFixture } from '../../../test/WebsitesFixture';

// Case : English
new TestFixture({
    plugin: {
        id: 'fastestmanga',
        title: 'Fastest Manga'
    },
    container: {
        url: 'https://www.fastestmanga.com/en/manga/murim-login/',
        id: JSON.stringify({ post: '1534', slug: '/en/manga/murim-login/' }),
        title: 'Murim Login'
    },
    child: {
        id: '/en/manga/murim-login/chapter-112/',
        title: 'Chapter 112'
    },
    entry: {
        index: 0,
        size: 414_940,
        type: 'image/webp'
    }
}).AssertWebsite();

// Case : Arabic
new TestFixture({
    plugin: {
        id: 'fastestmanga',
        title: 'Fastest Manga'
    },
    container: {
        url: 'https://www.fastestmanga.com/ar/manga/call-me-the-devil/',
        id: JSON.stringify({ post: '211', slug: '/ar/manga/call-me-the-devil/' }),
        title: 'Call me the devil'
    },
    child: {
        id: '/ar/manga/call-me-the-devil/fsl-38/',
        title: 'فصل 38'
    },
    entry: {
        index: 0,
        size: 53_506,
        type: 'image/webp'
    }
}).AssertWebsite();

// Case : Turkish
new TestFixture({
    plugin: {
        id: 'fastestmanga',
        title: 'Fastest Manga'
    },
    container: {
        url: 'https://www.fastestmanga.com/tr/manga/noblesse/',
        id: JSON.stringify({ post: '5183', slug: '/tr/manga/noblesse/' }),
        title: 'Noblesse'
    },
    child: {
        id: '/tr/manga/noblesse/bolum-480/',
        title: 'Bölüm 480'
    },
    entry: {
        index: 0,
        size: 31_964,
        type: 'image/webp'
    }
}).AssertWebsite();
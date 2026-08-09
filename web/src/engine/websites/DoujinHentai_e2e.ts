import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'doujinhentai',
        title: 'DoujinHentai'
    },
    container: {
        url: 'https://doujinhentai.net/manga-hentai/tits-tits-tits',
        id: '/manga-hentai/tits-tits-tits',
        title: 'Tits! Tits! Tits!'
    },
    child: {
        id: '/manga-hentai/tits-tits-tits/wife-packed-beach',
        title: 'Capítulo 1',
        timeout: 20_000
    },
    entry: {
        index: 0,
        size: 5_880_916,
        type: 'image/png'
    }
}).AssertWebsite();
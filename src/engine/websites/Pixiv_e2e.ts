import { TestFixture } from '../../../test/WebsitesFixture';

//Case : single artwork
new TestFixture({
    plugin: {
        id: 'pixiv',
        title: 'Pixiv'
    },
    container: {
        url: 'https://www.pixiv.net/en/artworks/105844494',
        id: 'artwork-105844494',
        title: 'into the window'
    },
    child: {
        id: '105844494',
        title: 'into the window'
    },
    entry: {
        index: 0,
        size: 1_457_665,
        type: 'image/png'
    }
}).AssertWebsite();

//Case : serie
new TestFixture({
    plugin: {
        id: 'pixiv',
        title: 'Pixiv'
    },
    container: {
        url: 'https://www.pixiv.net/user/11750032/series/88243',
        id: '88243',
        title: 'Nejo Adventures'
    },
    child: {
        id: '87788599',
        title: 'Chosen one'
    },
    entry: {
        index: 0,
        size: 143_699,
        type: 'image/png'
    }
}).AssertWebsite();
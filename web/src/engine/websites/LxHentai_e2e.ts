import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lxhentai',
        title: 'LxHentai (Hentai LXX)'
    },
    container: {
        url: 'https://lxmanga.store/truyen/nu-than-ke-ben',
        id: '/truyen/nu-than-ke-ben',
        title: 'Nữ thần kế bên'
    },
    child: {
        id: '/truyen/nu-than-ke-ben/chapter-65',
        title: 'Chapter 65'
    },
    entry: {
        index: 0,
        size: 751_307,
        type: 'image/jpeg',
        timeout: 10000
    }
};

new TestFixture(config).AssertWebsite();
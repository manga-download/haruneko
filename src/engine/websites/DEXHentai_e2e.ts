import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dexhentai',
        title: 'DEXHentai'
    },
    container: {
        url: 'https://dexhentai.com/title/800-years-promise/',
        id: '/title/800-years-promise/',
        title: '800 Years Promise'
    },
    child: {
        id: '/800-years-promise/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 178_279,
        type: 'image/jpeg'
    }
}).AssertWebsite();
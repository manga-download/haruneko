import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tenmanga',
        title: 'TenManga'
    },
    container: {
        url: 'https://www.tenmanga.com/book/Yoroizuka-san+wo+Baburasetai.html',
        id: '/book/Yoroizuka-san+wo+Baburasetai.html',
        title: 'Yoroizuka-san wo Baburasetai',
    },
    child: {
        id: '/chapter/YoroizukasanwoBaburasetai20/8875086/',
        title: '20',
    },
    entry: {
        index: 0,
        size: 302_559,
        type: 'image/jpeg'
    }
}).AssertWebsite();
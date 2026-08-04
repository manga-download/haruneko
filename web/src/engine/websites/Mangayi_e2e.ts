import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangayi',
        title: 'Mangayi'
    },
    container: {
        url: 'https://mangayi.com/read/akane-banashi/',
        id: '/read/akane-banashi/',
        title: 'Akane Banashi'
    },
    child: {
        id: '/read/akane-banashi/chapter/213/',
        title: 'Chapter 213'
    },
    entry: {
        index: 1,
        size: 172_625,
        type: 'image/jpeg'
    }
}).AssertWebsite();
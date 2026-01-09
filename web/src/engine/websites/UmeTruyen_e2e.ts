import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'umetruyen',
        title: 'UmeTruyen'
    },
    container: {
        url: 'https://umetruyenz.org/truyen-vet-do.html',
        id: '/truyen-vet-do.html',
        title: 'Vết Đỏ'
    },
    child: {
        id: '/truyen-vet-do/chapter-18',
        title: 'Chapter 18'
    },
    entry: {
        index: 0,
        size: 970_896,
        type: 'image/jpeg'
    }
}).AssertWebsite();
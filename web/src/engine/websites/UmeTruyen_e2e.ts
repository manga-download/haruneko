import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'umetruyen',
        title: 'UmeTruyen'
    },
    container: {
        url: 'https://umetruyenhay.com/truyen-vet-do.html',
        id: '/truyen-vet-do.html',
        title: 'Vết Đỏ'
    },
    child: {
        id: '/truyen-vet-do/chapter-18',
        title: 'Chapter 18'
    },
    entry: {
        index: 0,
        size: 1_266_999,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
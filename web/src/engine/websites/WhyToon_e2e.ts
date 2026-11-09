import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'whytoon',
        title: 'WhyToon'
    },
    container: {
        url: 'https://whytoon.com/content/expired-heart',
        id: '/content/expired-heart',
        title: 'Expired Heart - หัวใจหมดอายุ'
    },
    child: {
        id: '/content/expired-heart/55',
        title: 'ตอนที่ 55'
    },
    entry: {
        index: 2,
        size: 246_922,
        type: 'image/webp'
    }
}).AssertWebsite();
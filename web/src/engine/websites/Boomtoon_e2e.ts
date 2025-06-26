import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'boomtoon',
        title: 'Boomtoon'
    },
    container: {
        url: 'https://www.boomtoon.com/detail/stupid_cupid',
        id: 'stupid_cupid',
        title: 'รุ่นพี่จอมบื้อกับรุ่นน้องตัวแสบ'
    },
    child: {
        id: 'f1',
        title: 'Preview'
    },
    entry: {
        index: 0,
        size: 136_802,
        type: 'image/webp'
    }
}).AssertWebsite();

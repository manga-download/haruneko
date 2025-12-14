import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'readtoon',
        title: 'ReadToon'
    },
    container: {
        url: 'https://readtoon.com/content/mission-to-save-seven-villainesses',
        id: 'mission-to-save-seven-villainesses',
        title: 'ภารกิจช่วยเหลือ ตัวร้ายสาวทั้งเจ็ด'
    },
    child: {
        id: './content/mission-to-save-seven-villainesses/14',
        title: 'ตอนที่ 14'
    },
    entry: {
        index: 4,
        size: 655_304,
        type: 'image/webp'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'doujinlc',
        title: 'DoujinLC'
    },
    container: {
        url: 'https://doujin-lc.net/doujin/woman-massage/',
        id: JSON.stringify({ post: '106316', slug: '/doujin/woman-massage/' }),
        title: 'Woman Massage'
    },
    child: {
        id: encodeURI('/doujin/woman-massage/ซีซั่น-1/ตอนที่-25/').toLowerCase(),
        title: 'ตอนที่ 25'
    },
    entry: {
        index: 2,
        size: 435_017,
        type: 'image/jpeg'
    }
}).AssertWebsite();
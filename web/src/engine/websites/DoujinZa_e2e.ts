import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'doujinza',
        title: 'DoujinZa'
    },
    container: {
        url: 'https://doujinza.com/doujin/happy-campus/',
        id: JSON.stringify({ post: '15811', slug: '/doujin/happy-campus/' }),
        title: 'Happy Campus'
    },
    child: {
        id: encodeURI('/doujin/happy-campus/ตอนที่-31/').toLowerCase(),
        title: 'ตอนที่ 31'
    },
    entry: {
        index: 0,
        size: 1_093_282,
        type: 'image/jpeg'
    }
}).AssertWebsite();
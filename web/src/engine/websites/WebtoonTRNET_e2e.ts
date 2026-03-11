import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webtoontrnet',
        title: 'Webtoon TR'
    },
    container: {
        url: 'https://webtoontr.net/webtoon/as-long-as-you-like-it/',
        id: JSON.stringify({ post: '10458', slug: '/webtoon/as-long-as-you-like-it/' }),
        title: 'As Long As You Like It'
    },
    child: {
        id: '/webtoon/as-long-as-you-like-it/bolum-39/',
        title: 'Bölüm 39'
    },
    entry: {
        index: 1,
        size: 939_452,
        type: 'image/jpeg'
    }
}).AssertWebsite();
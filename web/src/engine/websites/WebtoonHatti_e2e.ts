import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webtoonhatti',
        title: 'Webtoon Hatti'
    },
    container: {
        url: 'https://webtoonhatti.dev/webtoon/suikascinin-kanunlari/',
        id: JSON.stringify({ post: '22986', slug: '/webtoon/suikascinin-kanunlari/' }),
        title: 'Suikasçının Kanunları'
    },
    child: {
        id: '/webtoon/suikascinin-kanunlari/bolum-28/',
        title: 'Bölüm 28'
    },
    entry: {
        index: 0,
        size: 1_082_948,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
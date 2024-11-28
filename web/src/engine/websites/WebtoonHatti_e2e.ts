import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webtoonhatti',
        title: 'Webtoon Hatti'
    },
    container: {
        url: 'https://webtoonhatti.com/webtoon/bokutachi-wa-benkyou-ga-dekinai/',
        id: JSON.stringify({ post: '15001', slug: '/webtoon/bokutachi-wa-benkyou-ga-dekinai/' }),
        title: 'Bokutachi wa Benkyou ga Dekinai'
    },
    child: {
        id: '/webtoon/bokutachi-wa-benkyou-ga-dekinai/bolum-109/',
        title: 'Bölüm 109'
    },
    entry: {
        index: 0,
        size: 556_719,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
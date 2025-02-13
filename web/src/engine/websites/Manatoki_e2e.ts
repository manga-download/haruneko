/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manatoki',
        title: 'Manatoki'
    },
    container: {
        url: 'https://manatoki468.net/comic/122227',
        id: '/comic/122227',
        title: '원피스(ONE PIECE)'
    },
    child: {
        id: '/comic/21341954',
        title: '1133화'
    },
    entry: {
        index: 0,
        size: 351_586,
        type: 'image/jpeg'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'manatoki',
        title: 'Manatoki'
    },
    container: {
        url: 'https://manatoki468.net/webtoon/1095458/템빨',
        id: encodeURI('/webtoon/1095458/템빨'),
        title: '템빨'
    },
    child: {
        id: '/webtoon/44573542/템빨-260화',
        title: '260화'
    },
    entry: {
        index: 0,
        size: 121_760,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/
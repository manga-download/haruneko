/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toongod',
        title: 'ToonGod'
    },
    container: {
        url: 'https://www.toongod.org/webtoon/i-stole-the-number-one-rankers-soul/',
        id: JSON.stringify({ post: '9019', slug: '/webtoon/i-stole-the-number-one-rankers-soul/' }),
        title: 'I Stole the Number One Ranker�s Soul'
    },
    child: {
        id: '/webtoon/i-stole-the-number-one-rankers-soul/chapter-64/',
        title: 'Chapter 64'
    },
    entry: {
        index: 0,
        size: 704_355,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/
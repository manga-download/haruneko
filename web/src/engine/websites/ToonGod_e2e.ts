import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'toongod',
        title: 'ToonGod'
    },
    /* CloudFlare
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
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
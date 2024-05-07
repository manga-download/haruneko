import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'freewebtooncoins',
        title: 'Free Webtoon Coins'
    },
    container: {
        url: 'https://freewebtooncoins.com/webtoon/i-see-your-death/',
        id: JSON.stringify({ post: '9700', slug: '/webtoon/i-see-your-death/' }),
        title: 'I See Your Death'
    },
    child: {
        id: '/webtoon/i-see-your-death/chapter-3/',
        title: 'Chapter 3'
    },
    entry: {
        index: 0,
        size: 82_038,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
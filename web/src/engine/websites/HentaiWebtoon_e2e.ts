import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentaiwebtoon',
        title: 'Hentai Webtoon'
    },
    container: {
        url: 'https://hentaiwebtoon.com/manga/not-friends-raw/',
        id: JSON.stringify({ post: '65252', slug: '/manga/not-friends-raw/' }),
        title: 'Not Friends Raw'
    },
    child: {
        id: '/manga/not-friends-raw/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 186_568,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
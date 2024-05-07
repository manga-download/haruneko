import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'summanga',
        title: 'SumManga'
    },
    container: {
        url: 'https://summanga.com/manga/chief-ministers-wife/',
        id: JSON.stringify({ post: '2297', slug: '/manga/chief-ministers-wife/' }),
        title: 'Chief Minister’s Wife'
    },
    child: {
        id: '/manga/chief-ministers-wife/chapter-68/',
        title: 'Chapter 68'
    },
    entry: {
        index: 0,
        size: 91_523,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
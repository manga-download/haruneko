import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'readfreecomics',
        title: 'ReadFreeComics'
    },
    container: {
        url: 'https://readfreecomics.com/webtoon-comic/martial-peak/',
        id: JSON.stringify({ post: '6948', slug: '/webtoon-comic/martial-peak/' }),
        title: 'Martial Peak'
    },
    child: {
        id: '/webtoon-comic/martial-peak/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 165_260,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
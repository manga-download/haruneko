import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangabob',
        title: 'MangaBob'
    },
    container: {
        url: 'https://mangabob.com/manga/my-eight-husbands-are-here/',
        id: JSON.stringify({ post: '14263', slug: '/manga/my-eight-husbands-are-here/' }),
        title: 'My Eight Husbands Are Here!'
    },
    child: {
        id: '/manga/my-eight-husbands-are-here/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 50_409,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
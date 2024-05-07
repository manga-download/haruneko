import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'freecomiconline',
        title: 'Free Comic Online'
    },
    container: {
        url: 'https://freecomiconline.me/comic/daughter-friend-raw/',
        id: JSON.stringify({ post: '13014', slug: '/comic/daughter-friend-raw/' }),
        title: 'Daughter Friend Raw'
    },
    child: {
        id: '/comic/daughter-friend-raw/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 249_175,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
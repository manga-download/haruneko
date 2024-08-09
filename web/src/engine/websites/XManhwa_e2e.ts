import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xmanhwa',
        title: 'XManhwa'
    },
    container: {
        url: 'https://www.xmanhwa.me/manga/cold-hot/',
        id: JSON.stringify({ post: '25936', slug: '/manga/cold-hot/' }),
        title: 'Cold? Hot!'
    },
    child: {
        id: '/manga/cold-hot/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 193_651,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
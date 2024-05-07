import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'newmanhua',
        title: 'NewManhua'
    },
    container: {
        url: 'https://newmanhua.com/manga/my-system-is-very-serious/',
        id: JSON.stringify({ post: '471', slug: '/manga/my-system-is-very-serious/' }),
        title: 'My System Is Very Serious',
    },
    child: {
        id: '/manga/my-system-is-very-serious/chapter-8/',
        title: 'Chapter 8'
    },
    entry: {
        index: 1,
        size: 1_717_871,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'readmanhua',
        title: 'ReadManhua'
    },
    container: {
        url: 'https://readmanhua.net/manga/the-ghostly-doctor-mg/',
        id: JSON.stringify({ post: '1917', slug: '/manga/the-ghostly-doctor-mg/' }),
        title: 'The Ghostly Doctor'
    },
    child: {
        id: '/manga/the-ghostly-doctor-mg/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 358_967,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
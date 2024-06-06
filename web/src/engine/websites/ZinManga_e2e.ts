import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zinmanga',
        title: 'ZinManga'
    },
    container: {
        url: 'https://mangazin.org/manga/my-teacher-has-chosen-my-husband-candidates/',
        id: JSON.stringify({ post: '39008', slug: '/manga/my-teacher-has-chosen-my-husband-candidates/' }),
        title: 'My Teacher Has Chosen My Husband Candidates'
    },
    child: {
        id: '/manga/my-teacher-has-chosen-my-husband-candidates/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 114_486,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
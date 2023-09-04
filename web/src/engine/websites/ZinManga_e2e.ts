import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zinmanga',
        title: 'ZinManga'
    },
    container: {
        url: 'https://zinmanga.com/manga/my-teacher-has-chosen-my-husband-candidates/',
        id: JSON.stringify({ post: '39008', slug: '/manga/my-teacher-has-chosen-my-husband-candidates/' }),
        title: 'My Teacher Has Chosen My Husband Candidates'
    },
    child: {
        id: '/manga/my-teacher-has-chosen-my-husband-candidates/chapter-0/',
        title: 'chapter 0'
    },
    entry: {
        index: 0,
        size: 114_486,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
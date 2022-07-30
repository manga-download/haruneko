import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lordmanga',
        title: 'Lord Manga'
    },
    container: {
        url: 'https://lordmanga.com/manga/classroom-undercover/',
        id: JSON.stringify({ post: '2895', slug: '/manga/classroom-undercover/' }),
        title: 'Classroom Undercover'
    },
    child: {
        id: '/manga/classroom-undercover/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 48_136,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
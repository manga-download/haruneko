import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'jirocomics',
        title: 'Jirocomics'
    },
    container: {
        url: 'https://jirocomics.com/manga/classroom-of-the-elite/',
        id: JSON.stringify({ post: '1916', slug: '/manga/classroom-of-the-elite/' }),
        title: 'Classroom of the Elite'
    },
    // The website itself is broken and does not list chapters
    /*
    child: {
        id: '/manga/classroom-of-the-elite/chapter-50/',
        title: 'Chapter 50'
    },
    entry: {
        index: 1,
        size: 2_292_568,
        type: 'image/png'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'muctau',
        title: 'BibiManga'
    },
    container: {
        url: 'https://bibimanga.com/manga/insanely-radiant/',
        id: JSON.stringify({ post: '195988', slug: '/manga/insanely-radiant/' }),
        title: 'Insanely Radiant'
    },
    child: {
        id: '/manga/insanely-radiant/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 181_762,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
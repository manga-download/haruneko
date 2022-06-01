import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'chibimanga',
        title: 'ChibiManga'
    },
    container: {
        url: 'https://www.cmreader.info/manga/teens-house/',
        id: JSON.stringify({ post: '2212', slug: '/manga/teens-house/' }),
        title: 'Teens House'
    },
    child: {
        id: '/manga/teens-house/volume-1/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 489_060,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
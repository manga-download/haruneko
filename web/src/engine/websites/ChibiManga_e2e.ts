import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'chibimanga',
        title: 'ChibiManga',
        timeout: 60_000
    },
    container: {
        url: 'https://www.cmreader.info/manga/teens-house/',
        id: JSON.stringify({ post: '2212', slug: '/manga/teens-house/' }),
        title: 'Teens House',
        timeout: 15_000
    },
    child: {
        id: '/manga/teens-house/volume-1/chapter-1/',
        title: 'Chapter 1',
        timeout: 15_000
    },
    entry: {
        index: 0,
        size: 489_060,
        type: 'image/jpeg',
        timeout: 15_000
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
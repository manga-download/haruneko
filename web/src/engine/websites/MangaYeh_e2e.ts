import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangayeh',
        title: 'MangaYeh'
    },
    container: {
        url: 'https://w13.mangayeh.com/manga-info/mercenary-enrollment',
        id: '/manga-info/mercenary-enrollment',
        title: 'Mercenary Enrollment'
    },
    child: {
        id: '/chapter/mercenary-enrollment/chapter-126',
        title: 'Chapter 126',
        timeout : 20000,
    },
    entry: {
        index: 0,
        size: 447_970,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaswat',
        title: 'SWAT Manga'
    },
    container: {
        url: 'https://swatop.club/manga/emperor-and-the-female-knight/',
        id: '/manga/emperor-and-the-female-knight/',
        title: 'Emperor And The Female Knight'
    },
    child: {
        id: '/1664788/s-emperor-and-the-female-knight-184/',
        title: 'الفصل رقم: 184 FREE',
    },
    entry: {
        index: 1,
        size: 846_705,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'readkomik',
        title: 'ReadKomik'
    },
    container: {
        url: 'https://readkomik.com/manga/superhuman-battlefield/',
        id: '/manga/superhuman-battlefield/',
        title: 'Superhuman Battlefield'
    },
    child: {
        id: '/shb-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 77_262,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
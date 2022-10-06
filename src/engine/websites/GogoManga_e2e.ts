import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'gogomanga',
        title: 'Gogomanga'
    },
    container: {
        url: 'https://gogomanga.fun/manga/demonic-emperor/',
        id: '/manga/demonic-emperor/',
        title: 'Demonic Emperor'
    },
    child: {
        id: '/the-devil-butler-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 175_165,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
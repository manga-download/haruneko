import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'aresmanga',
        title: 'Ares Manga'
    },
    container: {
        url: 'https://aresnov.org/series/martial-god-asura/',
        id: '/series/martial-god-asura/',
        title: 'Martial God Asura'
    },
    child: {
        id: '/45454-martial-god-asura-chapter-1/',
        title: 'الفصل 1'
    },
    entry: {
        index: 1,
        size: 177_147,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
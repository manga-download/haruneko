import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bacakomikid',
        title: 'BacaKomikID'
    },
    container: {
        url: 'https://bacakomikid.net/manga/gwei/',
        id: '/manga/gwei/',
        title: 'Gwei'
    },
    child: {
        id: '/gwei-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 135_243,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
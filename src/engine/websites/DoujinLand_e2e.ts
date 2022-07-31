import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'doujinland',
        title: 'DOUJINLAND'
    },
    container: {
        url: 'https://doujinland.my.id/series/boarding-diary-uncensored/',
        id: '/series/boarding-diary-uncensored/',
        title: 'Boarding Diary (uncensored)'
    },
    child: {
        id: '/2021/06/11/boarding-diary-chapter-01-uncensored/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 549_419,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
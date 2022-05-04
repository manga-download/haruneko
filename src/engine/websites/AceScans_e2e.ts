import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'acescans',
        title: 'Ace Scans'
    },
    container: {
        url: 'https://acescans.xyz/manga/guilty-circle/',
        id: '/manga/guilty-circle/',
        title: 'Guilty Circle'
    },
    child: {
        id: '/guilty-circle-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 661_783,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
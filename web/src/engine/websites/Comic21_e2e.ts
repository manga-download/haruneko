import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comic21',
        title: 'Comic21'
    },
    container: {
        url: 'https://comic21.me/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak',
        timeout: 15000,
    },
    child: {
        id: '/martial-peak-chapter-3633/',
        title: 'Chapter 3633',
        timeout: 15000,
    },
    entry: {
        index: 0,
        size: 241_154,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
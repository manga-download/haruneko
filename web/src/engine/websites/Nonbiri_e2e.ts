import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nonbiri',
        title: 'Nonbiri'
    },
    container: {
        url: 'https://nonbiri.space/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-chapter-3633/',
        title: 'Chapter 3633'
    },
    entry: {
        index: 0,
        size: 875_889,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
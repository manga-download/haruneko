import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sweettimescan',
        title: 'Sweet Time Scan'
    },
    container: {
        url: 'https://sweetscan.net/manga/the-monster-duches/',
        id: '{"post":"24","slug":"/manga/the-monster-duches/"}',
        title: 'The Monster Duchess And Contract Princess'
    },
    child: {
        id: '/manga/the-monster-duches/cap-110/',
        title: 'Cap. 110 - Capítulo 110'
    },
    entry: {
        index: 0,
        size: 2_104_152,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
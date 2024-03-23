import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangademon',
        title: 'MangaDemon'
    },
    container: {
        url: 'https://demonreader.org/manga/Martial-Peak-VA50',
        id: '/manga/Martial-Peak-VA50',
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/Martial-Peak/chapter/3670-VA50',
        title: '3670'
    },
    entry: {
        index: 0,
        size: 189_790,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
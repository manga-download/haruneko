import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangademon',
        title: 'MangaDemon'
    },
    container: {
        url: 'https://demoncomics.org/manga/Martial-Peak-VA48',
        id: '/manga/Martial-Peak-VA48',
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/Martial-Peak/chapter/3670-VA48',
        title: '3670'
    },
    entry: {
        index: 0,
        size: 328_479,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
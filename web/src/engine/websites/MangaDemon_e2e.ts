import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangademon',
        title: 'MangaDemon'
    },
    container: {
        url: 'https://mgdemon.org/manga/Martial-Peak-VA54',
        id: '/manga/Martial-Peak-VA54',
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/Martial-Peak/chapter/3670-VA54',
        title: '3670'
    },
    entry: {
        index: 0,
        size: 328_479,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
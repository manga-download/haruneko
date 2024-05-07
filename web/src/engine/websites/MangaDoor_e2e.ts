import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadoor',
        title: 'MangaDoor'
    },
    container: {
        url: 'https://mangadoor.com/manga/kanojo-mo-kanojo',
        id: '/manga/kanojo-mo-kanojo',
        title: 'Kanojo mo Kanojo'
    },
    child: {
        id: '/manga/kanojo-mo-kanojo/139',
        title: '139'
    },
    entry: {
        index: 0,
        size: 146_301,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
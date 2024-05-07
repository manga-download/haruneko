import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scantradunion',
        title: 'Scantrad Union'
    },
    container: {
        url: 'https://scantrad-union.com/manga/aiki/',
        id: '/manga/aiki/',
        title: 'Aiki'
    },
    child: {
        id: '/read/aiki/chapter-98.00/page-1/',
        title: '#98'
    },
    entry: {
        index: 1,
        size: 316_146,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
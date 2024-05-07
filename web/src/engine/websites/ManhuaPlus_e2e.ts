import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuaplus',
        title: 'ManhuaPlus'
    },
    container: {
        url: 'https://manhuaplus.org/manga/martial-peak01',
        id: '/manga/martial-peak01',
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/martial-peak01/chapter-500',
        title: 'Chapter 500'
    },
    entry: {
        index: 0,
        size: 183_750,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
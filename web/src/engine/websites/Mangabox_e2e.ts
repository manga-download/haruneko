import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangabox',
        title: 'Mangabox'
    },
    container: {
        url: 'https://www.mangabox.me/reader/220/episodes/',
        id: '220',
        title: 'オンライン The Comic'
    },
    child: {
        id: '/reader/220/episodes/133391/',
        title: '第206話'
    },
    entry: {
        index: 0,
        size: 216_414,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangacim',
        title: 'Mangacim'
    },
    container: {
        url: 'https://mangacim.com/manga/dukun-99-gelini/',
        id: '/manga/dukun-99-gelini/',
        title: 'Dük’ün 99.Gelini'
    },
    child: {
        id: '/dukun-99-gelini-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 265_312,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
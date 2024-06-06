import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentairead',
        title: 'HentaiRead'
    },
    container: {
        url: 'https://hentairead.com/hentai/meccha-kimochi-yokattassho/',
        id: '/hentai/meccha-kimochi-yokattassho/',
        title: 'Meccha Kimochi Yokattassho?'
    },
    child: {
        id: '/hentai/meccha-kimochi-yokattassho/english/p/1/',
        title: 'Meccha Kimochi Yokattassho?'
    },
    entry: {
        index: 0,
        size: 102_024,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
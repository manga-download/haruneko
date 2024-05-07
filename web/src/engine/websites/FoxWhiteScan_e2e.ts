import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'foxwhitescan',
        title: 'Fox White Scan'
    },
    container: {
        url: 'https://foxwhite.com.br/manga/serei-a-rainha/',
        id: JSON.stringify({ post: '2182', slug: '/manga/serei-a-rainha/' }),
        title: 'Nesta Vida, eu serei a Rainha'
    },
    child: {
        id: '/manga/serei-a-rainha/cap-64/',
        title: 'Cap. 64'
    },
    entry: {
        index: 1,
        size: 2_856_328,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
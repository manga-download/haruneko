import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sushiscans',
        title: 'Sushi Scans'
    },
    /* CloudFlare
    container: {
        url: 'https://sushiscan.net/catalogue/a-fantasy-lazy-life/',
        id: '/catalogue/a-fantasy-lazy-life/',
        title: 'A Fantasy Lazy Life'
    },
    child: {
        id: '/a-fantasy-lazy-life-volume-1/',
        title: 'Volume 1'
    },
    entry: {
        index: 0,
        size: 1_092_370,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
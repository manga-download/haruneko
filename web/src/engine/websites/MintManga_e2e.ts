import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mintmanga',
        title: 'MintManga'
    },
    container: {
        url: 'https://23.mintmanga.one/blagoslovenie_nebojitelei__A5327',
        id: '/blagoslovenie_nebojitelei__A5327',
        title: 'Heaven Official’s Blessing',
    },
    child: {
        id: '/blagoslovenie_nebojitelei__A5327/vol8/98',
        title: '8 - 98 Кто прав, кто виноват',
        timeout: 50000

    },
    entry: {
        index: 0,
        size: 3_678_062,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
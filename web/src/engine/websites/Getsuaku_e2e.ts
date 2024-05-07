import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'getsuaku',
        title: 'Getsuaku'
    },
    container: {
        url: 'https://getsuaku.com/episode/001_gaw_maidragon',
        id: '/episode/001_gaw_maidragon',
        title: '小林さんちのメイドラゴン',
        timeout: 15000
    },
    child: {
        id: '/episode/001_gaw_maidragon',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_441_630,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
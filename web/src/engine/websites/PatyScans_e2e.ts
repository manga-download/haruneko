import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'patyscans',
        title: 'PatyScans'
    },
    container: {
        url: 'https://lector.patyscans.com/series/hnk/',
        id: '/series/hnk/',
        title: '[No Touhou] Houseki no Kuni',
    },
    child: {
        id: '/read/hnk/es/11/100/',
        title: 'Capítulo 100: Armonía',
    },
    entry: {
        index: 0,
        size: 385_678,
        type: 'image/png',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
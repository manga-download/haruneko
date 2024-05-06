import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'digitalteam',
        title: 'DigitalTeam'
    },
    container: {
        url: 'https://dgtread.com/reader/series/ayanashi',
        id: '/reader/series/ayanashi',
        title: 'Ayanashi'
    },
    child: {
        id: '/reader/read/ayanashi/1/1',
        title: 'Volume 1 Capitolo 1: Il ragazzo venuto dalla superficie'
    },
    entry: {
        index: 0,
        size: 635_012,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
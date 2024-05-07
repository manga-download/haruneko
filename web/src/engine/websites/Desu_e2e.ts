import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'desu',
        title: 'Desu'
    },
    container: {
        url: 'https://desu.me/manga/wondance.3628/',
        id: '/manga/wondance.3628/',
        title: 'WonDance'
    },
    child: {
        id: '/manga/wondance.3628/vol1/ch1/rus',
        title: 'Том 1. Глава 1 - Танец Ванды-сан'
    },
    entry: {
        index: 5,
        size: 146_711,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
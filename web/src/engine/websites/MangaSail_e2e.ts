import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangasail',
        title: 'MangaSail',
    },
    container: {
        url: 'https://www.sailmg.com/content/rooster-fighter',
        id: '/content/rooster-fighter',
        title: 'Rooster Fighter',
        //timeout: 15_000,

    },
    child: {
        id: '/content/rooster-fighter-15?page=all',
        title: '15',
        timeout: 15_000,

    },
    entry: {
        index: 0,
        size: 68_247,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
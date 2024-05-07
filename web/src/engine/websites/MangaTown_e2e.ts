import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangatown',
        title: 'MangaTown',
    },
    container: {
        url: 'https://www.mangatown.com/manga/goblin_slayer/',
        id: '/manga/goblin_slayer/',
        title: 'Goblin Slayer'
    },
    child: {
        id: '/manga/goblin_slayer/c078/',
        title: '78',
        //timeout: 20_000,

    },
    entry: {
        index: 0,
        size: 236_152,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
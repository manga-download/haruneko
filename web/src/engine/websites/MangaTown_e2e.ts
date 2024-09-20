import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configMultiPage: Config = {
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
    },
    entry: {
        index: 0,
        size: 236_152,
        type: 'image/jpeg'
    }
};

const fixtureMultiPage = new TestFixture(configMultiPage);
describe(fixtureMultiPage.Name, async () => (await fixtureMultiPage.Connect()).AssertWebsite());

const configSinglePage: Config = {
    plugin: {
        id: 'mangatown',
        title: 'MangaTown',
    },
    container: {
        url: 'https://www.mangatown.com/manga/witch_hunter/',
        id: '/manga/witch_hunter/',
        title: 'Witch Hunter'
    },
    child: {
        id: '/manga/witch_hunter/v12/c234/',
        title: '234',
    },
    entry: {
        index: 0,
        size: 205_356,
        type: 'image/jpeg'
    }
};

const fixtureSinglePage = new TestFixture(configSinglePage);
describe(fixtureSinglePage.Name, async () => (await fixtureSinglePage.Connect()).AssertWebsite());
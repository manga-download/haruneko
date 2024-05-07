import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'goldenmangas',
        title: 'GoldenMangas'
    },
    container: {
        url: 'https://goldenmangas.top/mangabr/go-away-romeo',
        id: '/mangabr/go-away-romeo',
        title: 'Go Away Romeo'
    },
    child: {
        id: '/mangabr/go-away-romeo/05',
        title: 'Cap 05'
    },
    entry: {
        index: 1,
        size: 931_991,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
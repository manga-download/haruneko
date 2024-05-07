import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'legacyscans',
        title: 'Legacy-Scans'
    },
    container: {
        url: 'https://legacy-scans.com/comics/reaper-of-the-drifting-moon',
        id: '/comics/reaper-of-the-drifting-moon',
        title: 'Reaper of the Drifting Moon'
    },
    child: {
        id: '/comics/reaper-of-the-drifting-moon/chapter/55',
        title: 'Chapitre 55'
    },
    entry: {
        index: 1,
        size: 111_768,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
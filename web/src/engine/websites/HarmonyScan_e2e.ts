import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'harmonyscan',
        title: 'Harmony Scan'
    },
    container: {
        url: 'https://banana-scan.com/manga/a-rank-boukensha-no-slow-life/',
        id: '/manga/a-rank-boukensha-no-slow-life/',
        title: 'A-Rank Boukensha No Slow Life'
    },
    child: {
        id: '/a-rank-boukensha-no-slow-life-chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 1,
        size: 964_314,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
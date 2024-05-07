import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lirescan',
        title: 'LireScan'
    },
    container: {
        url: 'https://lire-scan.me/manga/51-kingdom.html',
        id: '/manga/51-kingdom.html',
        title: 'Kingdom'
    },
    child: {
        id: '/manga/51-kingdom/chapitre-774.html',
        title: '774'
    },
    entry: {
        index: 0,
        size: 3_538_686,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
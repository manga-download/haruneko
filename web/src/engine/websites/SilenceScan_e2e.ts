import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'silencescan',
        title: 'Silence Scan'
    },
    container: {
        url: 'https://silencescan.com.br/manga/temple/',
        id: '/manga/temple/',
        title: 'Temple'
    },
    child: {
        id: '/temple-capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 292_957,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
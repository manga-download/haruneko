import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mryaoi',
        title: 'MrYaoi'
    },
    container: {
        url: 'https://mrbenne.com/manga/romance-but-not-romantic/',
        id: JSON.stringify({ slug: '/manga/romance-but-not-romantic/'}),
        title: 'Romance, but not romantic'
    },
    child: {
        id: '/manga/romance-but-not-romantic/capitulo-02/',
        title: 'Capítulo 02'
    },
    entry: {
        index: 0,
        size: 813_083,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
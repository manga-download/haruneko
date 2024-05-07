import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhwasnet',
        title: 'Manhwas'
    },
    container: {
        url: 'https://manhwas.net/manga/las-constelaciones-son-mis-discipulos',
        id: '/manga/las-constelaciones-son-mis-discipulos',
        title: 'Las constelaciones son mis discipulos'
    },
    child: {
        id: '/leer/las-constelaciones-son-mis-discipulos-36.00',
        title: 'Capítulo 36.00',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 84_486,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
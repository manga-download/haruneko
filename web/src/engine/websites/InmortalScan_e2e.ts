import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'inmortalscan',
        title: 'Inmortal Scan'
    },
    container: {
        url: 'https://manga.mundodrama.site/mg/memoir-of-the-king-of-war/',
        id: JSON.stringify({ post: '1864', slug: '/mg/memoir-of-the-king-of-war/' }),
        title: 'Memorias del Rey de la Guerra'
    },
    child: {
        id: '/mg/memoir-of-the-king-of-war/capitulo-150/',
        title: 'capitulo 150'
    },
    entry: {
        index: 1,
        size: 359_607,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
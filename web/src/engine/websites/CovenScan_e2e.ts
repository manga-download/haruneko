import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'covenscan',
        title: 'CovenScan'
    },
    container: {
        url: 'https://cvnscan.com/manga/a-predadora/',
        id: JSON.stringify({ slug: '/manga/a-predadora/' }),
        title: 'Predadora'
    },
    child: {
        id: '/manga/a-predadora/capitulo-01',
        title: 'Capítulo 01'
    },
    entry: {
        index: 1,
        size: 1_229_902,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
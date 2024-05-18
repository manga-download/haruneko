import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'culturedworks',
        title: 'Cultured Works'
    },
    container: {
        url: 'https://culturedworks.com/manga/golden-print/',
        id: '/manga/golden-print/',
        title: 'Golden Print'
    },
    child: {
        id: '/golden-print-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 940_848,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangainn',
        title: 'MangaInn'
    },
    container: {
        url: 'https://www.mangainn.net/freezing_zero',
        id: '/freezing_zero',
        title: 'Freezing Zero'
    },
    child: {
        id: '/freezing_zero/38/all-pages',
        title: '38'
    },
    entry: {
        index: 0,
        size: 201_052,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
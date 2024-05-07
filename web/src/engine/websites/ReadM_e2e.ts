import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'readm',
        title: 'Read M'
    },
    container: {
        url: 'https://readm.org/manga/apotheosis-elevation-to-the-status-of-a-god/',
        id: '/manga/apotheosis-elevation-to-the-status-of-a-god/',
        title: 'Apotheosis - Elevation to the status of a god'
    },
    child: {
        id: '/manga/apotheosis-elevation-to-the-status-of-a-god/1055/all-pages',
        title: 'Chapter 1055'
    },
    entry: {
        index: 0,
        size: 610_177,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
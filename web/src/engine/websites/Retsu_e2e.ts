import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'retsu',
        title: 'Retsu'
    },
    container: {
        url: 'https://retsu.org/manga/hajimete-no-gal/',
        id: JSON.stringify({ post: '2485', slug: '/manga/hajimete-no-gal/'}),
        title: 'Hajimete no Gal'
    },
    child: {
        id: '/manga/hajimete-no-gal/vol-01/ch-001/',
        title: 'Ch.001 - The First Prostrate'
    },
    entry: {
        index: 0,
        size: 215_936,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
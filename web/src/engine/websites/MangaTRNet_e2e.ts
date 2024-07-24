import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangatrnet',
        title: 'MangaTR (.Net)'
    },
    container: {
        url: 'https://mangatr.net/manga/king-of-apocalypse/',
        id: JSON.stringify({ post: '1121', slug: '/manga/king-of-apocalypse/'}),
        title: 'King of Apocalypse'
    },
    child: {
        id: '/manga/king-of-apocalypse/bolum-323/',
        title: 'Bölüm: 323'
    },
    entry: {
        index: 2,
        size: 345_058,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
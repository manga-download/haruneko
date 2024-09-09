import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'yaoimangaoku',
        title: 'YaoiMangaOku'
    },
    container: {
        url: 'https://yaoimangaoku.com/manga/she-is-still-cute-today/',
        id: JSON.stringify({ post: '681', slug: '/manga/she-is-still-cute-today/'}),
        title: 'She Is Still Cute Today'
    },
    child: {
        id: '/manga/she-is-still-cute-today/bolum-77/',
        title: 'Bölüm 77'
    },
    entry: {
        index: 1,
        size: 911_522,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
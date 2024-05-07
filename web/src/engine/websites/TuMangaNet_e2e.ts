import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tumanganet',
        title: 'TuMangaNet'
    },
    container: {
        url: 'https://tumangas.net/manga/rey-no-muerto',
        id: '/manga/rey-no-muerto',
        title: 'Rey no Muerto'
    },
    child: {
        id: '/leer-manga/rey-no-muerto-37.00',
        title: 'Capitulo 37.00'
    },
    entry: {
        index: 0,
        size: 226_814,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
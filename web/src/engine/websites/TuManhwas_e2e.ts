import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tumanhwas',
        title: 'TuManhwas'
    },
    /* CloudFlare
    container: {
        url: 'https://tumanhwas.com/manga/la-magia-de-un-retornado-debe-ser-especial',
        id: '/manga/la-magia-de-un-retornado-debe-ser-especial',
        title: 'La magia de un retornado debe ser especial'
    },
    child: {
        id: '/news/la-magia-de-un-retornado-debe-ser-especial-243.00',
        title: 'Cap�tulo 243.00'
    },
    entry: {
        index: 0,
        size: 489_311,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
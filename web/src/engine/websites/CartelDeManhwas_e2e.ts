import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'carteldemanhwas',
        title: 'Cartel De Manhwas'
    },
    container: {
        url: 'https://carteldemanhwas.com/series/la-esposa-de-reemplazo-del-billeton/',
        id: '/series/la-esposa-de-reemplazo-del-billeton/',
        title: 'La Esposa de reemplazo del billetón (Descensurado)'
    },
    child: {
        id: '/la-esposa-de-reemplazo-del-billeton-capitulo-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 127_144,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
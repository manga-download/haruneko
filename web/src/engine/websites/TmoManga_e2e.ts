import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tmomanga',
        title: 'TmoManga'
    },
    container: {
        url: 'https://tmomanga.com/manga/levantate-y-brilla-heroe',
        id: '/manga/levantate-y-brilla-heroe',
        title: '¡Levántate y brilla, héroe! (Rise and Shine, Hero!)'
    },
    child: {
        id: '/capitulo/levantate-y-brilla-heroe-30.00',
        title: 'Capítulo 30.00'
    },
    entry: {
        index: 0,
        size: 976_710,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
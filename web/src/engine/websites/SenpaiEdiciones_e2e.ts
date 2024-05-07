import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'senpaiediciones',
        title: 'Senpai Ediciones'
    },
    container: {
        url: 'https://senpaiediciones.com/manga/clase-suplementaria-especial-despues-de-la-escuela/',
        id: '/manga/clase-suplementaria-especial-despues-de-la-escuela/',
        title: 'Clase Suplementaria Especial Después de la Escuela'
    },
    child: {
        id: '/clase-suplementaria-especial-despues-de-la-escuela-capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 355_129,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
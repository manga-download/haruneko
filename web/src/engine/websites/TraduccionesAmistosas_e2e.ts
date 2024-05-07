import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'traduccionesamistosas',
        title: 'Traducciones Amistosas'
    },
    container: {
        url: 'https://nartag.com/l/el-retorno-del-jugador',
        id: '/l/el-retorno-del-jugador',
        title: 'El retorno del jugador'
    },
    child: {
        id: '/v/el-retorno-del-jugador/capitulo-135',
        title: 'Capitulo 135'
    },
    entry: {
        index: 2,
        size: 1_027_155,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
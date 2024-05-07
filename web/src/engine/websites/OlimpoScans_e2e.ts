import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'olimposcans',
        title: 'OlimpoScans'
    },
    container: {
        url: 'https://olimposcans.com/comic-bjorn-el-barbaro.html',
        id: '/comic-bjorn-el-barbaro.html',
        title: 'BJORN EL BARBARO'
    },
    child: {
        id: '/leer-bjorn-el-barbaro-capitulo-50.html',
        title: 'Capítulo 50',
    },
    entry: {
        index: 1,
        size: 273_422,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
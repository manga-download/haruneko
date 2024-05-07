import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'submanga',
        title: 'Submanga',
        timeout: 40000
    },
    container: {
        url: 'https://submanga.bio/manga/-el-h-roe-de-nivel-m-ximo-ha-regresado',
        id: '/manga/-el-h-roe-de-nivel-m-ximo-ha-regresado',
        title: '¡El Héroe De Nivel Máximo Ha Regresado'
    },
    child: {
        id: '/manga/-el-h-roe-de-nivel-m-ximo-ha-regresado/64',
        title: '64'
    },
    entry: {
        index: 0,
        size: 32_670,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'raikiscan',
        title: 'Raiki Scan'
    },
    container: {
        url: 'https://raikiscan.com/manga/invencible-desde-el-principio/',
        id: '/manga/invencible-desde-el-principio/',
        title: 'Invencible desde el principio'
    },
    child: {
        id: '/invencible-desde-el-principio-capitulo-0/',
        title: 'Capítulo 0',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 3_105_220,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
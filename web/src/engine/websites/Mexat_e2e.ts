import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mexat',
        title: 'مانجا مكسات (Mexat)',
    },
    container: {
        url: 'https://manga.mexat.com/category/nanatsu-no-taizai/',
        id: '/category/nanatsu-no-taizai/',
        title: 'Nanatsu no Taizai',
        timeout: 15000
    },
    child: {
        id: '/%d8%a7%d9%84%d8%a7%d8%b3%d8%aa%d8%b1%d8%af%d8%a7%d8%af/',
        title: '247'
    },
    entry: {
        index: 0,
        size: 206_782,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
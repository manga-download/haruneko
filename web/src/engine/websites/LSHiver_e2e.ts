import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lshiver',
        title: 'Liebe Schnee Hiver'
    },
    container: {
        url: 'https://lshistoria.com/manga/ters-harem-oyununun-icine-dustum/',
        id: '/manga/ters-harem-oyununun-icine-dustum/',
        title: 'Ters Harem Oyununun İçine Düştüm!'
    },
    child: {
        id: '/ters-harem-oyununun-icine-dustum-1-bolum/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 199_116,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
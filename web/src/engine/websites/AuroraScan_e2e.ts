import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'aurorascan',
        title: 'Aurora Scan'
    }, /* CloudFlare
    container: {
        url: 'https://aurorascan.net/a-estranha-historia-de-banwoldang/',
        id: '/a-estranha-historia-de-banwoldang/',
        title: 'A Estranha História de Banwoldang'
    },
    child: {
        id: '/a-estranha-historia-de-banwoldang/01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 3,
        size: 543_195,
        type: 'image/avif'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
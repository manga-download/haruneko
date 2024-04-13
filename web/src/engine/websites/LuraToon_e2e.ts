import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'luratoon',
        title: 'Lura Toon'
    },
    /* Cloudflare
    container: {
        url: 'https://luratoon.com/assassino-pietro/',
        id: '/assassino-pietro/',
        title: 'Assassino Pietro'
    },
    child: {
        id: '/assassino-pietro/30/',
        title: 'Capítulo 30'
    },
    entry: {
        index: 0,
        size: 102_715,
        type: 'image/avif'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
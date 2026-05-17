import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mhscans',
        title: 'MHScans'
    },
    container: {
        url: 'https://mhscans.com/series/de-un-simple-soldado-a-monarca/',
        id: JSON.stringify({ post: '2337', slug: '/series/de-un-simple-soldado-a-monarca/' }),
        title: 'De un Simple Soldado a Monarca'
    },
    child: {
        id: '/series/de-un-simple-soldado-a-monarca/capitulo-104/',
        title: 'Capítulo 104'
    },
    entry: {
        index: 2,
        size: 220_232,
        type: 'image/jpeg'
    }
}).AssertWebsite();
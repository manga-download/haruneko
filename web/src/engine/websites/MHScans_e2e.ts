import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mhscans',
        title: 'MHScans'
    },
    container: {
        url: 'https://mhscans.com/comics/mhscans-de-un-simple-soldado-a-monarca',
        id: '/comics/mhscans-de-un-simple-soldado-a-monarca',
        title: 'De un Simple Soldado a Monarca'
    },
    child: {
        id: '/leer/czAQJ6PwEOmukZaWv4RE5',
        title: 'Capítulo 104'
    },
    entry: {
        index: 2,
        size: 260_942,
        type: 'image/jpeg'
    }
}).AssertWebsite();
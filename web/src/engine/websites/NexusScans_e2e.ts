import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nexusscans',
        title: 'Nexus Scans'
    },
    container: {
        url: 'https://nexusscanlation.com/en/comics/un-diario-de-conquista',
        id: 'un-diario-de-conquista',
        title: 'Un diario de conquista'
    },
    child: {
        id: 'capitulo-85',
        title: '85'
    },
    entry: {
        index: 0,
        size: 458_671,
        type: 'image/png'
    }
}).AssertWebsite();

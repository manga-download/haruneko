import { TestFixture } from '../../../test/WebsitesFixture';

//Case: Scrambled picture
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

//Case: Encrypted picture
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
        id: 'capitulo-109',
        title: '109'
    },
    entry: {
        index: 0,
        size: 391_968,
        type: 'image/webp'
    }
}).AssertWebsite();

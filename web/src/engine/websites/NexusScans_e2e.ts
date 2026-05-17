import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nexusscans',
        title: 'Nexus Scans'
    },
    container: {
        url: 'https://nexusscanlation.com/series/estoy-abandonando-los-comics-eroticos-2',
        id: 'estoy-abandonando-los-comics-eroticos-2',
        title: 'Estoy abandonando los cómics eróticos'
    },
    child: {
        id: 'capitulo-30',
        title: '30'
    },
    entry: {
        index: 0,
        size: 110_626,
        type: 'image/jpeg'
    }
}).AssertWebsite();
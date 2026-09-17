import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-pt',
        title: 'MangaToon (Portuguese)',
    },
    container: {
        url: 'https://mangatoon.mobi/pt/pressagio-da-fenix?content_id=794541',
        id: '794541',
        title: 'Presságio da Fênix'
    },
    child: {
        id: '40341',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 37_568,
        type: 'image/webp'
    }
}).AssertWebsite();
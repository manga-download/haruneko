import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-es',
        title: 'MangaToon (Spanish)',
    },
    container: {
        url: 'https://mangatoon.mobi/es/la-princesa-del-emperador?content_id=1753528',
        id: '1753528',
        title: 'La Princesa del Emperador'
    },
    child: {
        id: '61720',
        title: 'Capítulo 1'
    },
    entry: {
        index: 4,
        size: 43_636,
        type: 'image/webp'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-it',
        title: 'MangaToon (Italian)',
    },
    container: {
        url: 'https://it.mangatoon.mobi/363449-cresco-un-dio-maschio-in-un-altro-mondo',
        id: '363449',
        title: 'Cresco un dio maschio in un altro mondo'
    },
    child: {
        id: '113',
        title: 'Ep.1'
    },
    entry: {
        index: 3,
        size: 12_526,
        type: 'image/webp'
    }
}).AssertWebsite();
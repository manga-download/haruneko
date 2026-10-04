import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'timelesstoons',
        title: 'Timeless Toons'
    },
    container: {
        url: 'https://timelesstoons.org/series/office-no-host-sama/',
        id: '/series/office-no-host-sama/',
        title: 'Office no Host-sama'
    },
    child: {
        id: '/chapter/651010b1fab-651131b4b71/',
        title: 'Chapter 1',
    },
    entry: {
        index: 1,
        size: 65_122,
        type: 'image/avif'
    }
}).AssertWebsite();
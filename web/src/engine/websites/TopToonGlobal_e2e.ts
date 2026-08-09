import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toptoonglobal',
        title: 'Toptoon (Global)'
    },
    container: {
        url: 'https://global.toptoon.com/content/103366',
        id: '103366',
        title: 'Evolution: Road to Space Monster'
    },
    child: {
        id: '/content/103366/151960',
        title: 'Episode 0'
    }, // Mandatory login
    /*entry: {
        index: 0,
        size: 295_216,
        type: 'image/webp'
    }*/
}).AssertWebsite();
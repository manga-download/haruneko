import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'roliascan',
        title: 'Rolia Scan'
    },
    container: {
        url: 'https://roliascan.com/manga/gachiakuta/',
        id: '/manga/gachiakuta/',
        title: 'Gachiakuta'
    },
    child: {
        id: '/manga/gachiakuta/chapter-74/',
        title: 'Chapter 74'
    },
    entry: {
        index: 1,
        size: 447_372,
        type: 'image/webp'
    }
}).AssertWebsite();
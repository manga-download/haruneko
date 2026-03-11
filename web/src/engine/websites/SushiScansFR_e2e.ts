import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sushiscansfr',
        title: 'Sushi Scans (.FR)'
    },
    container: {
        url: 'https://sushiscan.io/catalogue/a-fantasy-lazy-life/',
        id: '/catalogue/a-fantasy-lazy-life/',
        title: 'A Fantasy Lazy Life'
    },
    child: {
        id: '/a-fantasy-lazy-life-volume-1-vf/',
        title: 'Volume 1'
    },
    entry: {
        index: 1,
        size: 301_038,
        type: 'image/webp'
    }
}).AssertWebsite();
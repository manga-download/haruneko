import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sushiscans',
        title: 'Sushi Scans (NET)'
    },
    container: {
        url: 'https://sushiscan.net/catalogue/a-fantasy-lazy-life/',
        id: '/catalogue/a-fantasy-lazy-life/',
        title: 'A Fantasy Lazy Life'
    },
    child: {
        id: '/a-fantasy-lazy-life-volume-1/',
        title: 'Volume 1'
    },
    entry: {
        index: 0,
        size: 571_843,
        type: 'image/jpeg'
    }
}).AssertWebsite();
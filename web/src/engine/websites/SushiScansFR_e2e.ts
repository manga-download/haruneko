import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sushiscansfr',
        title: 'Sushi Scans (.FR)'
    },
    /* CloudFlare
    container: {
        url: 'https://sushiscan.fr/catalogue/a-fantasy-lazy-life/',
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
    }*/
};

new TestFixture(config).AssertWebsite();
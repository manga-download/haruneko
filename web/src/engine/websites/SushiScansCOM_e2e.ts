import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sushiscanscom',
        title: 'Sushi Scans (.COM)'
    },
    container: {
        url: 'https://sushi-scan.com/manga/a-fantasy-lazy-life/',
        id: '/manga/a-fantasy-lazy-life/',
        title: 'A Fantasy Lazy Life'
    },
    child: {
        id: '/a-fantasy-lazy-life-volume-1/',
        title: 'Volume 1',
        timeout: 10000
    },
    entry: {
        index: 1,
        size: 301_038,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();
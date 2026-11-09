import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tempestscans',
        title: 'Tempest Scans'
    },
    container: {
        url: 'https://juratempe.st/explore/yalniz-yukselis-ragnarok',
        id: 'yalniz-yukselis-ragnarok',
        title: 'Yalnız Yükseliş: Ragnarök'
    },
    child: {
        id: '13',
        title: 'Bölüm 13',
    },
    entry: {
        index: 3,
        size: 580_210,
        type: 'image/avif'
    }
}).AssertWebsite();
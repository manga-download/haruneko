import { TestFixture } from '../../../test/WebsitesFixture';

// Case : episodes
new TestFixture({
    plugin: {
        id: 'comicgardo',
        title: 'コミックガルド (Comic Gardo)'
    },
    container: {
        url: 'https://comic-gardo.com/episode/14079602755108116814',
        id: '/episode/14079602755108116814',
        title: '俺は星間国家の悪徳領主！'
    },
    child: {
        id: '/episode/3269754496561191129',
        title: '第1話「案内人」'
    },
    entry: {
        index: 0,
        size: 1_684_896,
        type: 'image/png'
    }
}).AssertWebsite();

// Case: volumes
new TestFixture({
    plugin: {
        id: 'comicgardo',
        title: 'コミックガルド (Comic Gardo)'
    },
    container: {
        url: 'https://comic-gardo.com/volume/4856001361321536462',
        id: '/volume/4856001361321536462',
        title: '俺は星間国家の悪徳領主！'
    }, /* Paid content
    child: {
        id: '/volume/4856001361321536462',
        title: '1'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/png'
    }*/
}).AssertWebsite();
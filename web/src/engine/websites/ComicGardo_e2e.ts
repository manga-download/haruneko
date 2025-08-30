import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicgardo',
        title: 'コミックガルド (Comic Gardo)'
    },
    container: {
        url: 'https://comic-gardo.com/episode/3269754496561191129',
        id: '/episode/3269754496561191129',
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
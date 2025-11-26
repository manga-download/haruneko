import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'stonescape',
        title: 'StoneScape'
    },
    container: {
        url: 'https://stonescape.xyz/series/otakugal/',
        id: JSON.stringify({ post: '36', slug: '/series/otakugal/' }),
        title: 'Gals Can’t Be Kind to Otaku!?'
    },
    child: {
        id: '/series/otakugal/ch-14/',
        title: 'Ch. 14'
    },
    entry: {
        index: 3,
        size: 440_046,
        type: 'image/png'
    }
}).AssertWebsite();
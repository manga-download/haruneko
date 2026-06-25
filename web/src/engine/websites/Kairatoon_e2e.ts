import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kairatoon',
        title: 'Kairatoon'
    },
    container: {
        url: 'https://kairatoon.com/webtoon/buyuk-dukun-bas-belasi-yeni-gelini',
        id: '/webtoon/buyuk-dukun-bas-belasi-yeni-gelini',
        title: `Büyük Dük'ün Baş belası Yeni Gelini`
    },
    child: {
        id: '/webtoon/buyuk-dukun-bas-belasi-yeni-gelini/bolum-1',
        title: 'Bölüm 1'
    },
    entry: {
        index: 2,
        size: 142_634,
        type: 'image/webp'
    }
}).AssertWebsite();
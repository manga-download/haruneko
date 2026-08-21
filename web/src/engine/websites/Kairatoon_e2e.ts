import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kairatoon',
        title: 'Kairatoon'
    },
    container: {
        url: 'https://kairatoon.com/webtoon/ben-ilahi-siyah-ejderhanin-imugisiyim',
        id: '/webtoon/ben-ilahi-siyah-ejderhanin-imugisiyim',
        title: 'Ben İlahi Siyah Ejderha’nın İmugisiyim!'
    },
    child: {
        id: '/webtoon/ben-ilahi-siyah-ejderhanin-imugisiyim/bolum-1',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 218_292,
        type: 'image/webp'
    }
}).AssertWebsite();
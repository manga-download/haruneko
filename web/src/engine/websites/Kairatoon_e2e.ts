import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kairatoon',
        title: 'Kairatoon'
    },
    container: {
        url: 'https://kairatoon.net/webtoon/ben-ilahi-siyah-ejderhanin-imugisiyim',
        id: '/webtoon/ben-ilahi-siyah-ejderhanin-imugisiyim',
        title: 'Ben İlahi Siyah Ejderha’nın İmugisiyim!'
    },
    /* Login Needed
    child: {
        id: '/webtoon/ben-ilahi-siyah-ejderhanin-imugisiyim/bolum-1',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 1_242_809,
        type: 'image/webp'
    }*/
}).AssertWebsite();
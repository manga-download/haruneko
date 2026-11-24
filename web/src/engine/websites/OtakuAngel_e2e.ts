import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'otakuangel',
        title: 'Otaku Angel',
    },
    container: {
        url: 'https://otakuangel.com/manga/2004-player-ga-gwageoreul-sung-gim',
        id: '/manga/2004-player-ga-gwageoreul-sung-gim',
        title: 'Player ga Gwageoreul Sunggim',
    },
    child: {
        id: '/manga/2004-player-ga-gwageoreul-sung-gim/145-bolum-145',
        title: 'Bölüm 145',
    },
    entry: {
        index: 0,
        size: 749_838,
        type: 'image/webp',
    }
}).AssertWebsite();
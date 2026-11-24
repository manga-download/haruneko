import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : raw pictures
new TestFixture({
    plugin: {
        id: 'soraraw',
        title: 'SoraRaw'
    },
    container: {
        url: 'https://soraraw.com/manga/rimootorabuhooru-52237',
        id: '/manga/rimootorabuhooru-52237',
        title: 'リモートラブホール'
    },
    child: {
        id: '/manga/rimootorabuhooru-52237/ch-93',
        title: '93'
    },
    entry: {
        index: 0,
        size: 137_157,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : scrambled pictures (method canva2)
new TestFixture({
    plugin: {
        id: 'soraraw',
        title: 'SoraRaw'
    },
    container: {
        url: 'https://soraraw.com/manga/rimootorabuhooru-52237',
        id: '/manga/rimootorabuhooru-52237',
        title: 'リモートラブホール'
    },
    child: {
        id: '/manga/rimootorabuhooru-52237/ch-129',
        title: '129'
    },
    entry: {
        index: 1,
        size: 1_143_734,
        type: 'image/png'
    }
}).AssertWebsite();

// CASE : scrambled pictures (method canva)
new TestFixture({
    plugin: {
        id: 'soraraw',
        title: 'SoraRaw'
    },
    container: {
        url: 'https://soraraw.com/manga/tanaka-katsuki-kakeru-tenka-mesu-ko-ingoshima-r-soushuuhen-d-70084',
        id: '/manga/tanaka-katsuki-kakeru-tenka-mesu-ko-ingoshima-r-soushuuhen-d-70084',
        title: '[田中克樹×天下雌子] インゴシマR総集編 第01巻'
    },
    child: {
        id: '/manga/tanaka-katsuki-kakeru-tenka-mesu-ko-ingoshima-r-soushuuhen-d-70084/ch-1',
        title: '1'
    },
    entry: {
        index: 1,
        size: 705_642,
        type: 'image/png'
    }
}).AssertWebsite();

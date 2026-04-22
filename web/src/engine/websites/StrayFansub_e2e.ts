import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'strayfansub',
        title: 'Stray Fansub'
    }, /* Need Login
    container: {
        url: 'https://strayfansub.site/manga/dash/',
        id: /manga/dash/ }),
        title: 'DASH'
    },
    child: {
        id: '/manga/dash/05-bolum/',
        title: '05. Bölüm'
    },
    entry: {
        index: 1,
        size: 1_368_758,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();
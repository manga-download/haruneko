import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'strayfansub',
        title: 'Stray Fansub'
    },
    container: {
        url: 'https://strayfansub.buzz/manga/dash/',
        id: '/manga/dash/',
        title: 'DASH'
    },
    child: {
        id: '/dash-7/',
        title: 'Bölüm 7'
    }, /* Need Login
    entry: {
        index: 1,
        size: 1_368_758,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();
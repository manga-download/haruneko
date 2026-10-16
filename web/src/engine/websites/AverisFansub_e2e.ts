import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'averisfansub',
        title: 'Averis Fansub'
    },
    container: {
        url: 'https://averisfansub.site/manga/backlight/',
        id: JSON.stringify({ post: '1795', slug: '/manga/backlight/' }),
        title: 'Backlight'
    },
    child: {
        id: '/manga/backlight/53-bolum/',
        title: '53. Bölüm'
    }, /* Login required: {
    entry: {
        index: 0,
        size: 52_384,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();
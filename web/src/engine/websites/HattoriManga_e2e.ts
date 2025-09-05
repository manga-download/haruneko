import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hattorimanga',
        title: 'Hattori Manga',
    },
    container: {
        url: 'https://hattorimanga.net/manga/moby-dick',
        id: '/manga/moby-dick',
        title: 'Moby Dick'
    },
    child: {
        id: '/manga/moby-dick/bolum-70',
        title: 'Bölüm 70'
    }, /* Login Needed
    entry: {
        index: 0,
        size: 398_912,
        type: 'image/webp'
    }*/
}).AssertWebsite();
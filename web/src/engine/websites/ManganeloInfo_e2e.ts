import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manganeloinfo',
        title: 'MangaNeloInfo',
    },
    container: {
        url: 'https://manganelo.info/the-regressed-doctor-just-wanted-to-live-quietly',
        id: '/the-regressed-doctor-just-wanted-to-live-quietly',
        title: 'The Regressed Doctor Just Wanted to Live Quietly'
    },
    child: {
        id: '/the-regressed-doctor-just-wanted-to-live-quietly/chapter-15',
        title: 'Chapter 15'
    },
    entry: {
        index: 0,
        size: 703_030,
        type: 'image/webp'
    }
}).AssertWebsite();
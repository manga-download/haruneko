import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'adonisfansub',
        title: 'Adonis Fansub'
    },
    container: {
        url: 'https://manga.adonisfansub.com/manga/nyx-stay-night/',
        id: '/manga/nyx-stay-night/',
        title: 'Nyx Stay Night'
    },
    child: {
        id: '/nyx-stay-night-bolum-0/',
        title: 'Bölüm 0 - Prolog'
    },
    entry: {
        index: 0,
        size: 408_328,
        type: 'image/jpeg'
    }
}).AssertWebsite();
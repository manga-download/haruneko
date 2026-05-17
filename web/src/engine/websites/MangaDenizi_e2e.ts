import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadenizi',
        title: 'Manga Denizi',
    },
    container: {
        url: 'https://www.mangadenizi.net/manga/yuuna-and-the-haunted-hot-springs',
        id: '/manga/yuuna-and-the-haunted-hot-springs',
        title: 'Yuuna and the Haunted Hot Springs',
    },
    child: {
        id: '/read/yuuna-and-the-haunted-hot-springs/209',
        title: 'Bölüm 209 - Yuuna [SON]'
    },
    entry: {
        index: 1,
        size: 230_076,
        type: 'image/webp',
    }
}).AssertWebsite();
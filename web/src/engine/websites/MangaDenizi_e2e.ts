import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadenizi',
        title: 'Manga Denizi',
    },
    container: {
        url: 'https://mangadenizi.net/manga/yuuna-and-the-haunted-hot-springs',
        id: 'yuuna-and-the-haunted-hot-springs',
        title: 'Yuuna and the Haunted Hot Springs',
    },
    child: {
        id: '209',
        title: 'Bölüm 209 - Yuuna [SON]'
    },
    entry: {
        index: 3,
        size: 1_365_777,
        type: 'image/png',
    }
}).AssertWebsite();
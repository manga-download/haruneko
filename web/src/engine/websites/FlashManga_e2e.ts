import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'flashmanga',
        title: 'Flash Manga'
    },
    container: {
        url: 'https://www.flash-manga.com/manga/killer-peter/',
        id: '/manga/killer-peter/',
        title: 'Killer Peter'
    },
    child: {
        id: '/killer-peter-94/',
        title: 'ตอนที่ 94'
    },
    entry: {
        index: 0,
        size: 390_222,
        type: 'image/jpeg'
    }
}).AssertWebsite();
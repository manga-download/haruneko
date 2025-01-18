import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangarussia',
        title: 'MangaRussia'
    },
    container: {
        url: 'https://www.mangarussia.com/manga/Дандадан.html',
        id: encodeURI('/manga/Дандадан.html'),
        title: 'Дандадан',
    },
    child: {
        id: encodeURI('/chapter/Дандадан+16+-+141+Переели+вкусняшек/4332724/'),
        title: '16 - 141 Переели вкусняшек',
    },
    entry: {
        index: 0,
        size: 819_587, // 752_216 or 819_587
        type: 'image/jpeg'
    }
}).AssertWebsite();
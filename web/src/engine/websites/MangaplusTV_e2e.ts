import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaplustv',
        title: 'MangaPlus.tv'
    },
    container: {
        url: 'https://mangaplus.shueisha.tv/truyen-tranh/wan-phis-1-th',
        id: '/truyen-tranh/wan-phis-1-th',
        title: 'วันพีซ'
    },
    child: {
        id: '/truyen-tranh/wan-phis-1-chap-1191-th.html',
        title: 'ตอนที่ 1191'
    },
    entry: {
        index: 0,
        size: 400_127,
        type: 'image/jpeg'
    }
}).AssertWebsite();

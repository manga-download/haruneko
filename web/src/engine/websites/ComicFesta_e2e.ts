import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicfesta',
        title: 'コミックフェスタ | ComicFesta'
    },
    container: {
        url: 'https://comic.iowl.jp/titles/171482',
        id: '/titles/171482',
        title: '悪役令嬢の発情期【タテヨミ】【フルカラー】',
    },
    child: {
        id: '/volumes/605060/free_download',
        title: '1'
    },
    entry: {
        index: 0,
        size: 315_948,
        type: 'image/png'
    }
}).AssertWebsite();
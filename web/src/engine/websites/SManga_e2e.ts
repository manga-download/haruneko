import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'smanga',
        title: 'S-Manga'
    },
    container: {
        url: 'https://www.s-manga.net/items/contents.html?isbn=978-4-08-883785-7',
        id: '35169',
        title: 'ONE PIECE',
        timeout: 15000
    },
    child: {
        id: '/reader/main.php?cid=9784088837857',
        title: '107'
    },
    entry: {
        index: 0,
        size: 2_613_081,
        type: 'image/png'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aesirscans',
        title: 'Aesir Scans'
    },
    container: {
        url: 'https://www.aesirscans.site/2026/01/ben-kotu-tanrnn-yaratcsym_28.html',
        id: '/2026/01/ben-kotu-tanrnn-yaratcsym_28.html',
        title: 'Ben, Kötü Tanrının Yaratıcısıyım'
    },
    child: {
        id: '/2026/01/chapter-1_28.html',
        title: 'Bölüm 1'
    },
    entry: {
        index: 3,
        size: 1_492_215,
        type: 'image/jpeg'
    }
}).AssertWebsite();
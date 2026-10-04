import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kazescans',
        title: 'Kaze Scans',
    },
    container: {
        url: 'https://www.kazescans.com/2026/01/return-of-apocalypse-class-death-knight.html',
        id: '/2026/01/return-of-apocalypse-class-death-knight.html',
        title: 'Return of the Apocalypse-Class Death Knight',
    },
    child: {
        id: '/2026/01/blog-post.html',
        title: 'Bölüm 1',
    },
    entry: {
        index: 0,
        size: 210_934,
        type: 'image/jpeg'
    }
}).AssertWebsite();
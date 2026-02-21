import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'reyume',
        title: 'Reyume',
    },
    container: {
        url: 'https://www.re-yume.my.id/2024/01/shangri-la-frontier-kusoge-hunter.html',
        id: '/2024/01/shangri-la-frontier-kusoge-hunter.html',
        title: 'Shangri-La Frontier ~Kusoge Hunter. Kamige ni Idoman to su~'
    },
    child: {
        id: '/2024/01/shangri-la-frontier-chapter-01.html',
        title: 'Chapter 01'
    },
    entry: {
        index: 2,
        size: 163_315,
        type: 'image/jpeg'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinscans',
        title: 'Merlin Scans'
    },
    container: {
        url: 'https://merlinscans.com.de/manga/akademinin-dehasi/',
        id: '/manga/akademinin-dehasi/',
        title: 'Akademinin Dehası'
    },
    child: {
        id: '/akademinin-dehasi-42/',
        title: 'Chapter 65'
    },
    entry: {
        index: 1,
        size: 553_600,
        type: 'image/webp'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinscans',
        title: 'Merlin Scans'
    },
    container: {
        url: 'https://merlintoon.com/manga/akademinin-dehasi/',
        id: '/manga/akademinin-dehasi/',
        title: 'Akademinin Dehası'
    },
    child: {
        id: '/manga/akademinin-dehasi/chapter-65/',
        title: 'Bölüm 65'
    },
    entry: {
        index: 0,
        size: 553_600,
        type: 'image/webp'
    }
}).AssertWebsite();
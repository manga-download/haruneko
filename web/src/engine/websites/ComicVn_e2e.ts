import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicvn',
        title: 'ComicVn'
    },
    container: {
        url: 'https://comicvn13.net/mau-do-long-son-67a1f438e6885976e14a3bb2.html',
        id: '/mau-do-long-son-67a1f438e6885976e14a3bb2.html',
        title: 'Máu đỏ lòng son'
    },
    child: {
        id: '/mau-do-long-son/chapter-1-67a1f54906a402681e289f83.html',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 630_027,
        type: 'image/jpeg'
    }
}).AssertWebsite();
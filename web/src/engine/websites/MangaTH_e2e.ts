import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangath',
        title: 'MangaTH'
    },
    container: {
        url: 'https://manga-th.net/manga/blue-lock',
        id: 'blue-lock',
        title: 'Blue Lock'
    },
    child: {
        id: '9e2f2ad6-7a64-4013-bdb5-4c6e972c51e5',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 410_315,
        type: 'image/jpeg'
    }
}).AssertWebsite();
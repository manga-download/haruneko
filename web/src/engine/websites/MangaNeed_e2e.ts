import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manganeed',
        title: 'MangaNeed'
    },
    container: {
        url: 'https://www.manganeed.com/comic-4152/index.html',
        id: '/comic-4152/index.html',
        title: 'ENEN NO SHOUBOUTAI'
    },
    child: {
        id: '/comic-4152/133121.html',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 217_342,
        type: 'image/jpeg'
    }
}).AssertWebsite();
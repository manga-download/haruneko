import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ikiru',
        title: 'Ikiru'
    },
    container: {
        url: 'https://02.ikiru.wtf/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/martial-peak/chapter-1.261519/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 124_648,
        type: 'image/jpeg'
    }
}).AssertWebsite();
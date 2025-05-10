import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ikiru',
        title: 'Ikiru'
    },
    container: {
        url: 'https://id.ikiru.wtf/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 124_648,
        type: 'image/jpeg'
    }
}).AssertWebsite();
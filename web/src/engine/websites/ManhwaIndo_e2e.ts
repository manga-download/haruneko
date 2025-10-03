import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwaindo',
        title: 'ManhwaIndo'
    },
    container: {
        url: 'https://manhwaindo.app/series/9th-class-sword-master/',
        id: '/series/9th-class-sword-master/',
        title: '9th Class Sword Master'
    },
    child: {
        id: '/9th-class-sword-master-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 65_237,
        type: 'image/jpeg'
    }
}).AssertWebsite();
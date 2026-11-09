import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwaindo',
        title: 'ManhwaIndo'
    },
    container: {
        url: 'https://www.manhwaindo.my/series/9th-class-sword-master/',
        id: '/series/9th-class-sword-master/',
        title: '9th Class Sword Master'
    },
    child: {
        id: '/9th-class-sword-master-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 84_843,
        type: 'image/jpeg'
    }
}).AssertWebsite();
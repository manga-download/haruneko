import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bacamanga',
        title: 'BacaManga'
    }, /* Region Locked : indonesia
    container: {
        url: 'https://komikindo4.com/komik/martial-peak/',
        id: '/komik/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-chapter-3772/',
        title: 'Chapter 3772'
    },
    entry: {
        index: 1,
        size: 224_158,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();
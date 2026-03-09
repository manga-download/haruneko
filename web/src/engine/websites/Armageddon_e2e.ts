import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'armageddon',
        title: 'Armageddon'
    },
    container: {
        url: 'https://www.silentquill.net/bisque-doll-de-chu/',
        id: '/bisque-doll-de-chu/',
        title: 'Bisque Doll de Chu'
    },
    child: {
        id: '/bisque-doll-de-chu-chapter-13/',
        title: 'Chapter 13'
    },
    entry: {
        index: 1,
        size: 252_536,
        type: 'image/webp'
    }
}).AssertWebsite();
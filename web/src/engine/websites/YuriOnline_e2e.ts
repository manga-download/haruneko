import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yurionline',
        title: 'Yuri Online'
    },
    container: {
        url: 'https://yuri-online.com/manga/cuando-el-corazon-cruza-los-limites/',
        id: JSON.stringify({ post: '4216', slug: '/manga/cuando-el-corazon-cruza-los-limites/' }),
        title: 'Cuando el corazón cruza los límites'
    },
    child: {
        id: '/manga/cuando-el-corazon-cruza-los-limites/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 1_036_525,
        type: 'image/jpeg'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toonjai',
        title: 'ToonJai'
    },
    container: {
        url: 'https://toonjai.com/content/my-beloved-goblin',
        id: 'my-beloved-goblin',
        title: 'My Beloved Goblin - ก๊อบลินที่รักของข้า'
    },
    child: {
        id: '43.2',
        title: 'ตอนที่ 43.2 ตอนพิเศษ 2'
    },
    entry: {
        index: 1,
        size: 541_874,
        type: 'image/webp'
    }
}).AssertWebsite();
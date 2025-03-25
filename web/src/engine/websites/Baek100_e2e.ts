import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'baek100',
        title: 'Baek 100 Scans'
    },
    container: {
        url: 'https://baektoons.com/manga/ancient-animals/',
        id: '/manga/ancient-animals/',
        title: 'Ancient Animals'
    },
    child: {
        id: '/ancient-animals-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 198_400,
        type: 'image/png'
    }
}).AssertWebsite();
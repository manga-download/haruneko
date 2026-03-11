import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'flowercomics',
        title: 'Flower Comics',
    },
    container: {
        url: 'https://flowercomics.jp/title/2216',
        id: '/title/2216',
        title: '覇王様の異世界花嫁'
    },
    child: {
        id: '/chapter/79154',
        title: '第0話'
    },
    entry: {
        index: 0,
        size: 285_536,
        type: 'image/webp'
    }
}).AssertWebsite();
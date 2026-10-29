import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lalatoon',
        title: 'Lalatoon'
    },
    container: {
        url: 'https://global.lalatoon.com/en/webtoon/episode/toon/7574',
        id: '/en/webtoon/episode/toon/7574',
        title: 'Cooking Sorcerer [en]'
    },
    child: {
        id: '/en/webtoon/detail/code/207305/ep/1/toon/7574',
        title: '1'
    },
    entry: {
        index: 1,
        size: 50_990,
        type: 'image/jpeg'
    }
}).AssertWebsite();
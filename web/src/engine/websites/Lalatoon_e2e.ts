import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lalatoon',
        title: 'Lalatoon'
    },
    container: {
        url: 'https://www.lalatoon.com/en/webtoon/episode/toon/7574',
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
};

new TestFixture(config).AssertWebsite();
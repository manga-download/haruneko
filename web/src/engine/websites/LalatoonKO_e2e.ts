import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lalatoonko',
        title: 'Lalatoon (KO)'
    },
    container: {
        url: 'https://www.lalatoon.com/kr/webtoon/episode/toon/8345',
        id: '/kr/webtoon/episode/toon/8345',
        title: '딜리셔스 블러드'
    },
    child: {
        id: '/kr/webtoon/detail/code/238059/ep/1/toon/8345',
        title: '1'
    },
    entry: {
        index: 1,
        size: 27_732,
        type: 'image/jpeg'
    }
}).AssertWebsite();
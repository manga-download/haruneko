import { TestFixture } from '../../../test/WebsitesFixture';

//As we coded the handling
new TestFixture({
    plugin: {
        id: 'toomics-ko',
        title: 'Toomics (Korean)'
    },
    container: {
        url: 'https://www.toomics.com/webtoon/episode/toon/7676',
        id: '/webtoon/episode/toon/7676',
        title: '사상최강의 데릴사위'
    },
    child: {
        id: '/webtoon/detail/code/188985/ep/1/toon/7676',
        title: '1'
    },
    entry: {
        index: 2,
        size: 474_869,
        type: 'image/jpeg'
    }
}).AssertWebsite();

//the special way, when manga id is not in url
new TestFixture({
    plugin: {
        id: 'toomics-ko',
        title: 'Toomics (Korean)'
    },
    container: {
        url: 'https://www.toomics.com/popular/popular_list/cut_list_idx/1648',
        id: '/webtoon/episode/toon/7676',
        title: '사상최강의 데릴사위'
    },
    child: {
        id: '/webtoon/detail/code/188985/ep/1/toon/7676',
        title: '1',
    },
    entry: {
        index: 2,
        size: 474_869,
        type: 'image/jpeg'
    }
}).AssertWebsite();

//The link that the users will most likely paste
new TestFixture({
    plugin: {
        id: 'toomics-ko',
        title: 'Toomics (Korean)'
    },
    container: {
        url: 'https://www.toomics.com/webtoon/bridge/type/2/toon/7676',
        id: '/webtoon/episode/toon/7676',
        title: '사상최강의 데릴사위'
    },
    child: {
        id: '/webtoon/detail/code/188985/ep/1/toon/7676',
        title: '1'
    },
    entry: {
        index: 2,
        size: 474_869,
        type: 'image/jpeg'
    }
}).AssertWebsite();
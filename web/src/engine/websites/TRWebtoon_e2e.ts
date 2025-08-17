import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'trwebtoon',
        title: 'TR Webtoon'
    },
    container: {
        url: 'https://trmanga.com/webtoon/oscar-zahnin-garip-seruvenleri',
        id: '/webtoon/oscar-zahnin-garip-seruvenleri',
        title: 'Oscar Zahn’ın Garip Serüvenleri'
    },
    child: {
        id: '/webtoon/oscar-zahnin-garip-seruvenleri/12',
        title: '#12'
    },
    entry: {
        index: 0,
        size: 1_280_801,
        type: 'image/jpeg'
    }
}).AssertWebsite();
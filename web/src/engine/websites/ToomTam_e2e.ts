import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toomtam',
        title: 'ToomTam'
    },
    container: {
        url: 'https://toomtam-manga.com/manga/dense-summer-firstlove/',
        id: '/manga/dense-summer-firstlove/',
        title: '#Dense #Summer #Firstlove'
    },
    child: {
        id: encodeURI('/dense-summer-firstlove-ตอนที่-1/').toLowerCase(),
        title: 'ตอนที่ 1'
    },
    entry: {
        index: 0,
        size: 128_953,
        type: 'image/jpeg'
    }
}).AssertWebsite();
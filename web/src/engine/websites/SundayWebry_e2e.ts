import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sundaywebry',
        title: 'サンデーうぇぶり (Sunday Webry)'
    },
    container: {
        url: 'https://www.sunday-webry.com/episode/14079602755274980354',
        id: '/episode/14079602755274980354',
        title: 'からかい上手の高木さん'
    },
    child: {
        id: '/episode/3269754496654358124',
        title: '1. 消しゴム'
    },
    entry: {
        index: 0,
        size: 464_547,
        type: 'image/png'
    }
}).AssertWebsite();
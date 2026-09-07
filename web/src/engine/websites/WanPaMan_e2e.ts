import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'wanpaman',
        title: 'Wan-Pa Man',
    },
    container: {
        url: 'http://galaxyheavyblow.web.fc2.com/',
        id: '/',
        title: 'ワンパンマン'
    },
    child: {
        id: '/fc2-imageviewer/?aid=1&iid=162',
        title: '第１６０話'
    },
    entry: {
        index: 0,
        size: 136_200,
        type: 'image/jpeg'
    }
}).AssertWebsite();
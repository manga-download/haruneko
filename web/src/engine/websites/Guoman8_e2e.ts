import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'guoman8',
        title: '国漫吧 (Guoman8)'
    },
    container: {
        url: 'https://www.guoman8.cc/48229/',
        id: '/48229/',
        title: '黄昏町囚徒'
    },
    child: {
        id: '/48229/01.html',
        title: '01话'
    },
    entry: {
        index: 0,
        size: 278_781,
        type: 'image/jpeg'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'younganimal',
        title: 'Young Animal'
    },
    container: {
        url: 'https://younganimal.com/series/8f24a114d125e',
        id: '/series/8f24a114d125e',
        title: '拷問バイトくんの日常'
    },
    child: {
        id: '/episodes/36b790450439c/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_049_810,
        type: 'image/png'
    }
}).AssertWebsite();
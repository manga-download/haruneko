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
        id: '/episodes/dfb216e571e81',
        title: '第1話',
        timeout: 10_000
    },
    entry: {
        index: 0,
        size: 1_100_568,
        type: 'image/png'
    }
}).AssertWebsite();
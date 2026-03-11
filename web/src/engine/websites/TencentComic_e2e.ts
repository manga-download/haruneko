import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tencentcomic',
        title: 'Tencent (Comic)'
    },
    container: {
        url: 'https://ac.qq.com/Comic/ComicInfo/id/530955',
        id: '/Comic/ComicInfo/id/530955',
        title: '戒魔人'
    },
    child: {
        id: '/ComicView/index/id/530955/cid/1',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 182_360,
        type: 'image/jpeg'
    }
}).AssertWebsite();
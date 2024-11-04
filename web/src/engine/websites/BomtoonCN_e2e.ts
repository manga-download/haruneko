import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bomtooncn',
        title: 'Bomtoon (Chinese)'
    },
    container: {
        url: 'https://www.bomtoon.tw/detail/successful_fan',
        id: 'successful_fan',
        title: '成功迷妹的秘密'
    },
    child: {
        id: 'f1',
        title: '非會員試閱'
    },
    entry: {
        index: 0,
        size: 49_570,
        type: 'image/webp'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'truyenqq',
        title: 'TruyenQQ'
    },
    container: {
        url: 'https://truyenqqno.com/truyen-tranh/long-phi-bat-bai-322',
        id: '/truyen-tranh/long-phi-bat-bai-322',
        title: 'Long Phi Bất Bại'
    },
    child: {
        id: '/truyen-tranh/long-phi-bat-bai-322-chap-156.html',
        title: 'Chương 156'
    },
    entry: {
        index: 1,
        size: 301_848,
        type: 'image/jpeg'
    }
}).AssertWebsite();
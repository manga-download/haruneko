import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dumanwu',
        title: 'Dumanwu'
    }, /* Geoblocked : China
    container: {
        url: 'https://dumanwu1.com/IVppVyi/',
        id: '/IVppVyi/',
        title: '斗罗大陆2绝世唐门'
    },
    child: {
        id: '/IVppVyi/DhNhNZq.html',
        title: '321 奇异的震荡弹'
    },
    entry: {
        index: 0,
        size: 168_972,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();
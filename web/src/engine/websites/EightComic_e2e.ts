import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eightcomic',
        title: '8Comic'
    },
    container: {
        url: 'https://www.8comic.com/html/23831.html',
        id: '/html/23831.html',
        title: '在卡拉OK和唱歌的大姐姐一起'
    },
    child: {
        id: 'https://articles.onemoreplace.tw/online/new-23831.html?ch=1',
        title: '第01話',
        timeout: 1_000
    },
    entry: {
        index: 0,
        size: 299_375,
        type: 'image/jpeg'
    }
}).AssertWebsite();
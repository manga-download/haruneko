import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dongmanmanhua',
        title: '咚漫 (DongMan Manhua)'
    },
    container: {
        url: 'https://www.dongmanmanhua.cn/FANTASY/dark-moon-the-blood-altar/list?title_no=1970',
        id: '/FANTASY/dark-moon-the-blood-altar/list?title_no=1970',
        title: 'DARK MOON: 月之神坛',
        timeout: 10000
    },
    child: {
        id: '/FANTASY/dark-moon-the-blood-altar/1-%E5%88%9D%E6%AC%A1%E8%A7%81%E9%9D%A2/viewer?title_no=1970&episode_no=1',
        title: '#1 - 1. 初次见面'
    },
    entry: {
        index: 0,
        size: 79_988,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
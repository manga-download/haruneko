import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dongmanmanhua',
        title: '咚漫 (DongMan Manhua)'
    },
    container: {
        url: 'https://www.dongmanmanhua.cn/FANTASY/dark-moon-the-blood-altar/list?title_no=1970',
        id: '/FANTASY/dark-moon-the-blood-altar/list?title_no=1970',
        title: 'DARK MOON: 月之神坛'
    },
    child: {
        id: '/FANTASY/dark-moon-the-blood-altar/57-%E6%AD%A3%E9%9D%A2%E7%AA%81%E5%87%BB/viewer?title_no=1970&episode_no=57',
        title: '#57 - 57. 正面突击'
    },
    entry: {
        index: 0,
        size: 171_097,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
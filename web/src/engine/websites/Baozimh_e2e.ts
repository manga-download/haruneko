import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'baozimh',
        title: '包子漫書 (baozimh)'
    },
    container: {
        url: 'https://www.baozimh.com/comic/wotianmingdafanpai-tianmingfanpaiyuanzhuhuizhudongman',
        id: '/comic/wotianmingdafanpai-tianmingfanpaiyuanzhuhuizhudongman',
        title: '我！天命大反派（隔週雙更）'
    },
    child: {
        id: '/user/page_direct?comic_id=wotianmingdafanpai-tianmingfanpaiyuanzhuhuizhudongman&section_slot=0&chapter_slot=53',
        title: '第53話 坦誠？'
    },
    entry: {
        index: 5,
        size: 164_832,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
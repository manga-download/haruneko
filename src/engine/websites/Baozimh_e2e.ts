import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
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
        size: 151_930,
        type: 'image/jpeg'
    }
}).AssertWebsite();
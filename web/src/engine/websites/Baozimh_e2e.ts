import { describe } from 'vitest';
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
        index: 53,
        size: 113_017,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
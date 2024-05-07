import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zuimh',
        title: '最漫画 (ZuiMH)'
    },
    container: {
        url: 'https://www.zuimh.com/manhua/chenshuiwanguchushihengtuizhutian/',
        id: '/manhua/chenshuiwanguchushihengtuizhutian/',
        title: '沉睡万古：出世横推诸天'
    },
    child: {
        id: '/manhua/chenshuiwanguchushihengtuizhutian/2108800.html',
        title: '1话 姜家祖地，任行觉醒！'
    },
    entry: {
        index: 0,
        size: 26_037,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
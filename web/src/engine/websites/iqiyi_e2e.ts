import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'iqiyi',
        title: 'iqiyi'
    },
    container: {
        url: 'https://www.iqiyi.com/manhua/detail_18yzmrvu2t.html',
        id: '/manhua/detail_18yzmrvu2t.html',
        title: '苍穹榜之圣灵纪',
    },
    child: {
        id: '/manhua/reader/18yzmrvu2t_18yzho1c7d.html',
        title: '1 第1话：灵路榜（上）',
    },
    entry: {
        index: 2,
        size: 327_902,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'taomanhua',
        title: '神漫画 (Tao Manhua)'
    },
    container: {
        url: 'https://www.taomanhua.com/bosschaoqiangdansongdeyaosi/',
        id: '108924',
        title: '离谱，你管这叫骷髅兵？'
    },
    child: {
        id: 'renshedangan-1663207710',
        title: '人设档案'
    },
    entry: {
        index: 0,
        size: 217_488,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
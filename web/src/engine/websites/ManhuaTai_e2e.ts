import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuatai',
        title: 'ManhuaTai'
    },
    container: {
        url: 'https://www.manhuatai.com/xitongbiwozuohuanghou/',
        id: '106935',
        title: '系统逼我做皇后'
    },
    child: {
        id: 'di290hua-1684488810',
        title: '第290话 快点赚积分的法子'
    },
    entry: {
        index: 0,
        size: 314_952,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
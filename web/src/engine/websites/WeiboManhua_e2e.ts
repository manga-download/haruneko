import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'weibomanhua',
        title: '微博动漫 (Weibo Manhua)',
    },
    container: {
        url: 'https://manhua.weibo.com/c/74247',
        id: '74247',
        title: '救命！穿越兽世蛇夫超宠我！'
    },
    child: {
        id: '471241',
        title: '人物档案放送'
    },
    entry: {
        index: 0,
        size: 273_663,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
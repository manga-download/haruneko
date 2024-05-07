import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'migudm',
        title: '咪咕 (Migudm)'
    },
    container: {
        url: 'https://www.migudm.cn/comic/090000001072.html',
        id: '/comic/090000001072.html',
        title: '青柠之夏',
        timeout: 10000,
    },
    child: {
        id: '/090000001072/chapter/1.html',
        title: '第1话',
        timeout: 20000,

    },
    entry: {
        index: 0,
        size: 160_419,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kuaikanmanhua',
        title: 'Kuaikanmanhua'
    },
    container: {
        url: 'https://www.kuaikanmanhua.com/web/topic/4832/',
        id: '/web/topic/4832/',
        title: '再度与你',
    },
    child: {
        id: '/web/comic/190853',
        title: '第1话 重遇初恋！？'
    },
    entry: {
        index: 0,
        size: 55_330,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
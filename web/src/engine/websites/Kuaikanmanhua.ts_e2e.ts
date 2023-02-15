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
        id: '/web/comic/210925',
        title: '第8话 改造'
    },
    entry: {
        index: 0,
        size: 19_261,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
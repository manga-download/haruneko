import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mundomangakun',
        title: 'Mundo Mangá-Kun'
    },
    container: {
        url: 'https://mundomangakun.com.br/manga/zui-wu-dao/',
        id: '/manga/zui-wu-dao/',
        title: 'Zui Wu Dao'
    },
    child: {
        id: '/zui-wu-dao-capitulo-01/',
        title: 'Capítulo 01',
        timeout: 13000
    },
    entry: {
        index: 1,
        size: 833_606,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
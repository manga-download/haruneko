import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicaction',
        title: 'webアクション (Comic Action)'
    },
    container: {
        url: 'https://comic-action.com/episode/13933686331665056851',
        id: '/episode/13933686331665056851',
        title: 'ダンジョンの中のひと'
    },
    child: {
        id: '/episode/14079602755075901255',
        title: '第32話'
    },
    entry: {
        index: 0,
        size: 500_250,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
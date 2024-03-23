import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'youngchampion',
        title: 'Young Champion'
    },
    container: {
        url: 'https://youngchampion.jp/series/b20f6fa2cc69a',
        id: '/series/b20f6fa2cc69a',
        title: '惨家'
    },
    child: {
        id: '/episodes/2aa2386bccbcd',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 2_649_022,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
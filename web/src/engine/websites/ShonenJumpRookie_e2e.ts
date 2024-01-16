import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'shonenjumprookie',
        title: 'ジャンプルーキー (Jump Rookie)'
    },
    container: {
        url: 'https://rookie.shonenjump.com/series/EmTZ65sTaHw',
        id: '/series/EmTZ65sTaHw',
        title: '不死鳥来たる'
    },
    child: {
        id: '/series/EmTZ65sTaHw/EmTZ65sTaH4',
        title: '第 1 話'
    },
    entry: {
        index: 0,
        size: 207_251,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
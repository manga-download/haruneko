import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'to-corona-ex',
        title: 'コロナ (to-corona-ex)'
    },
    container: {
        url: 'https://to-corona-ex.com/comics/20000000053321',
        id: '20000000053321',
        title: '転生令嬢は精霊に愛されて最強です……だけど普通に恋したい！'
    },
    child: {
        id: '20000000526432',
        title: '第1話'
    },
    entry: {
        index: 4,
        size: 1_974_099,
        type: 'image/png'
    }
}).AssertWebsite();
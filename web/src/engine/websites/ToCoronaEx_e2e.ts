import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        index: 0,
        size: 3_867_212,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
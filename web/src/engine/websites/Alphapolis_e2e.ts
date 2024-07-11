import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'alphapolis',
        title: 'ALPHAPOLIS (アルファポリス)'
    },
    container: {
        url: 'https://www.alphapolis.co.jp/manga/official/777000246',
        id: '/manga/official/777000246',
        title: '令嬢はまったりをご所望。'
    },
    child: {
        id: '/manga/official/777000246/2888',
        title: '第1回'
    },
    entry: {
        index: 0,
        size: 375_221,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
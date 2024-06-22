import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicryu',
        title: 'COMICリュウ'
    },
    container: {
        url: 'https://www.comic-ryu.jp/series/zingnize/',
        id: '/series/zingnize/',
        title: 'ZINGNIZE'
    },
    child: {
        id: '/2167/',
        title: '第一話「高坂甚内①」'
    },
    entry: {
        index: 0,
        size: 3_619_874,
        type: 'image/jpeg',
        timeout: 25000
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
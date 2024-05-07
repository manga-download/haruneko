import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'qimeitj',
        title: 'Qimeitj'
    },
    container: {
        url: 'https://qimeitj.com/book/2324',
        id: '/book/2324',
        title: '后宫太多，只好飞升了'
    },
    child: {
        id: '/chapter/144045',
        title: '035.5 洞天之内',
    },
    entry: {
        index: 0,
        size: 212_602,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
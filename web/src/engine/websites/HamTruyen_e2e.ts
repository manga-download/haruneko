import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hamtruyen',
        title: 'HamTruyen'
    },
    container: {
        url: 'https://hamtruyen.info/yeu-than-ky-1385.html',
        id: '/yeu-than-ky-1385.html',
        title: 'Yêu Thần Ký'
    },
    child: {
        id: '/doc-truyen/yeu-than-ky-chapter-376.html',
        title: 'Chapter 376'
    },
    entry: {
        index: 0,
        size: 182_509,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
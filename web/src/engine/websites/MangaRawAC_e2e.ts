import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarawac',
        title: 'MangaRawAC'
    },
    container: {
        url: 'https://mangaraw.ac/manga/%e5%9c%b0%e7%90%83%e9%98%b2%e8%a1%9b%e9%9a%8aX-raw-free/',
        id: '/manga/%e5%9c%b0%e7%90%83%e9%98%b2%e8%a1%9b%e9%9a%8aX-raw-free/',
        title: '地球防衛隊X'
    },
    child: {
        id: '/manga/%e5%9c%b0%e7%90%83%e9%98%b2%e8%a1%9b%e9%9a%8aX-raw-free/%E7%AC%AC3%E8%A9%B1/',
        title: '第3話'
    },
    entry: {
        index: 0,
        size: 1_350_530,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
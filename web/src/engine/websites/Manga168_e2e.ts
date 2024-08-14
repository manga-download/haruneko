import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga168',
        title: 'Manga168'
    },
    container: {
        url: 'https://manga168.net/manga/overgeared-remake/',
        id: '/manga/overgeared-remake/',
        title: 'Overgeared (Remake)'
    },
    child: {
        id: '/overgeared-remake-%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-215/',
        title: 'ตอนที่ 215'
    },
    entry: {
        index: 0,
        size: 498_942,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
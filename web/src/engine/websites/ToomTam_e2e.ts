import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'toomtam',
        title: 'ToomTam'
    },
    container: {
        url: 'https://toomtam-manga.com/manga/dense-summer-firstlove/',
        id: '/manga/dense-summer-firstlove/',
        title: '#Dense #Summer #Firstlove'
    },
    child: {
        id: '/dense-summer-firstlove-%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-1/',
        title: 'ตอนที่ 1'
    },
    entry: {
        index: 0,
        size: 128_953,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
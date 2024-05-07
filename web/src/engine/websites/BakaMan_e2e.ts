import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'bakaman',
        title: 'BAKAMAN'
    },
    container: {
        url: 'https://bakaman.net/manga/war-of-ragnarok/',
        id: JSON.stringify({ post: '18288', slug: '/manga/war-of-ragnarok/' }),
        title: 'War of Ragnarok'
    },
    child: {
        id: encodeURI('/manga/war-of-ragnarok/ตอนที่-1-1/').toLowerCase(),
        title: 'ตอนที่ 1.1'
    },
    entry: {
        index: 0,
        size: 573_382,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
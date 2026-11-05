import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'luascans',
        title: 'Lua Scans'
    },
    container: {
        url: 'https://luacomic.org/series/truck-driver-tag-team-match',
        id: JSON.stringify({ id: '107', slug: 'truck-driver-tag-team-match'}),
        title: 'Truck Driver Tag Team Match'
    },
    child: {
        id: JSON.stringify({ id: '5613', slug: 'chapter-7' }),
        title: 'Chapter 7'
    },
    entry: {
        index: 0,
        size: 465_292,
        type: 'image/webp'
    }
}).AssertWebsite();
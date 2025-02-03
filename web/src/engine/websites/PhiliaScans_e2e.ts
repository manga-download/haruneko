import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'philiascans',
        title: 'Philia Scans'
    },
    container: {
        url: 'https://philiascans.org/series/how-i-became-king-by-eating-monsters/',
        id: JSON.stringify({ post: '568', slug: '/series/how-i-became-king-by-eating-monsters/' }),
        title: 'How I Became King by Eating Monsters'
    },
    child: {
        id: '/series/how-i-became-king-by-eating-monsters/01/',
        title: '01'
    },
    entry: {
        index: 1,
        size: 174_298,
        type: 'image/webp'
    }
}).AssertWebsite();
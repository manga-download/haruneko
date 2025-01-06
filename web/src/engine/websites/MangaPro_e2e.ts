import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapro',
        title: 'Manga Pro'
    },
    container: {
        url: 'https://promanga.pro/series/i-eat-soft-rice-in-another-world',
        id: JSON.stringify({ slug: 'i-eat-soft-rice-in-another-world', id: 327 }),
        title: 'I Eat Soft Rice In Another World'
    },
    child: {
        id: '/series/i-eat-soft-rice-in-another-world/chapter-0',
        title: '0',
    },
    entry: {
        index: 0,
        size: 1_345_428,
        type: 'image/webp'
    }
}).AssertWebsite();
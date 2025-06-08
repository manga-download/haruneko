import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mikoroku',
        title: 'Mikoroku'
    },
    container: {
        url: 'https://www.mikoroku.com/2025/01/harem-ou-no-isekai-press-manyuuki_12.html',
        id: '/2025/01/harem-ou-no-isekai-press-manyuuki_12.html',
        title: 'Harem Ou no Isekai Press Manyuuki'
    },
    child: {
        id: '/2024/07/harem-ou-no-isekai-press-manyuuki_22.html',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 186_568,
        type: 'image/jpeg'
    }
}).AssertWebsite();
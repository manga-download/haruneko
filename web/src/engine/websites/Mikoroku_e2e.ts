import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mikoroku',
        title: 'Mikoroku'
    },
    container: {
        url: 'https://www.mikoroku.my.id/2025/01/ou-no-isekai-press-manyuuki.html',
        id: '/2025/01/ou-no-isekai-press-manyuuki.html',
        title: 'Harem Ou no Isekai Press Manyuuki'
    },
    child: {
        id: 'https://www.mikodrive.my.id/2024/07/harem-ou-no-isekai-press-manyuuki_22.html',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 186_568,
        type: 'image/jpeg'
    }
}).AssertWebsite();
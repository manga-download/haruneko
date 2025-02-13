import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nyxscans',
        title: 'Nyx Scans'
    },
    container: {
        url: 'https://nyxscans.com/series/maybe-meant-to-be',
        id: JSON.stringify({ slug: 'maybe-meant-to-be', id: 1}),
        title: 'Maybe Meant to Be'
    },
    child: {
        id: '/series/maybe-meant-to-be/chapter-98',
        title: '98'
    },
    entry: {
        index: 0,
        size: 878_946,
        type: 'image/webp'
    }
}).AssertWebsite();
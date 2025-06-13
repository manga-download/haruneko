import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hivescans',
        title: 'Hive Scans'
    },
    container: {
        url: 'https://hivetoons.org/series/maybe-meant-to-be',
        id: JSON.stringify({ slug: 'maybe-meant-to-be', id: 27 }),
        title: 'Maybe Meant to Be'
    },
    child: {
        id: '/series/maybe-meant-to-be/chapter-93',
        title: '93'
    },
    entry: {
        index: 0,
        size: 501_034,
        type: 'image/webp'
    }
}).AssertWebsite();
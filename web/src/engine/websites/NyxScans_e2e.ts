import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nyxscans',
        title: 'Nyx Scans'
    },
    container: {
        url: 'https://nyxscans.com/series/maybe-meant-to-be',
        id: '1',
        title: 'Maybe Meant to Be'
    },
    child: {
        id: '/series/maybe-meant-to-be/chapter-98',
        title: 'Chapter 98'
    },
    entry: {
        index: 16,
        size: 694_014,
        type: 'image/webp'
    }
}).AssertWebsite();
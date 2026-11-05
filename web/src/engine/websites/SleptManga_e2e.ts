import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sleptmanga',
        title: 'Slept Manga',
    },
    container: {
        url: 'https://sleptmanga.com.tr/manhwa/a-morning-kiss-at-tiffanys',
        id: '/manhwa/a-morning-kiss-at-tiffanys',
        title: `A morning kiss at Tiffany's`
    },
    child: {
        id: 'a-morning-kiss-at-tiffanys/6',
        title: 'Bölüm 6'
    },
    entry: {
        index: 1,
        size: 321_653,
        type: 'image/jpeg'
    }
}).AssertWebsite();
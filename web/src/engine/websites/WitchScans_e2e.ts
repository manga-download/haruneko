import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'witchscans',
        title: 'Witch Scans'
    },
    container: {
        url: 'https://witchscans.com/manga/acting-gangster/',
        id: '/manga/acting-gangster/',
        title: 'Acting Gangster'
    },
    child: {
        id: '/acting-gangster-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 675_632,
        type: 'image/webp'
    }
}).AssertWebsite();
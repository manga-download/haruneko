import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'scythescans',
        title: 'Scythe Scans'
    },
    container: {
        url: 'https://scythescans.com/manga/the-shepherd-wizard/',
        id: '/manga/the-shepherd-wizard/',
        title: 'The Shepherd Wizard'
    },
    child: {
        id: '/the-shepherd-wizard-chapter-11/',
        title: 'Chapter 11'
    },
    entry: {
        index: 1,
        size: 751_206,
        type: 'image/webp'
    }
}).AssertWebsite();
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangassscans',
        title: 'Mangas-Scans'
    },
    container: {
        url: 'https://mangas-scans.com/manga/the-rebirth-of-an-8th-circled-wizard/',
        id: '/manga/the-rebirth-of-an-8th-circled-wizard/',
        title: '8th Circle Mage Reborn'
    },
    child: {
        id: '/the-rebirth-of-an-8th-circled-wizard-chapter-160/',
        title: 'Chapitre 160'
    },
    entry: {
        index: 1,
        size: 720_735,
        type: 'image/jpeg'
    }
}).AssertWebsite();
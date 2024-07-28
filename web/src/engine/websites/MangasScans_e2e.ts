import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangassscans',
        title: 'Mangas-Scans'
    }, /* CloudFlare
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
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
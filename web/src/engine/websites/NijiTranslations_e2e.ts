import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nijitranslations',
        title: 'مدونة نيجي (Niji Translations)'
    },
    container: {
        url: 'https://niji-translations.com/manga/bright-and-cheery-amnesia/',
        id: JSON.stringify({ post: '8317', slug: '/manga/bright-and-cheery-amnesia/' }),
        title: 'Bright and Cheery Amnesia'
    },
    child: {
        id: '/manga/bright-and-cheery-amnesia/00/',
        title: '00'
    },
    entry: {
        index: 0,
        size: 640_227,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
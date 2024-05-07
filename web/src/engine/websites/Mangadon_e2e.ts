import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadon',
        title: 'Mangadon'
    },
    container: {
        url: 'https://mangadon.me/catalogs/show?tb=60',
        id: '60',
        title: 'Spooky Tokyo'
    },
    child: {
        id: '14591',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 232_401,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
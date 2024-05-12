import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangahubfr',
        title: 'MangaHubFR'
    },
    /* CloudFlare
    container: {
        url: 'https://mangahub.fr/manga/black-winter/',
        id: JSON.stringify({ post: '19040', slug: '/manga/black-winter/' }),
        title: 'Black Winter'
    },
    child: {
        id: '/manga/black-winter/chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 1,
        size: 1_092_114,
        type: 'image/png'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
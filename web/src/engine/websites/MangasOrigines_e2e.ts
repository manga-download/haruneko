import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasorigines',
        title: 'Mangas Origines'
    },
    /* CloudFlare
    container: {
        url: 'https://mangas-origines.fr/oeuvre/top-tier-providence/',
        id: JSON.stringify({ post: '508', slug: '/oeuvre/top-tier-providence/' }),
        title: 'Top Tier Providence'
    },
    child: {
        id: '/oeuvre/top-tier-providence/chapitre-0/',
        title: 'Chapitre 0'
    },
    entry: {
        index: 1,
        size: 865_895,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
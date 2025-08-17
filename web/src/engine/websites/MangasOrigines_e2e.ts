import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangasorigines',
        title: 'Mangas Origines'
    },

    container: {
        url: 'https://mangas-origines.fr/oeuvre/top-tier-providence/',
        id: JSON.stringify({ post: '508', slug: '/oeuvre/top-tier-providence/' }),
        title: 'Top Tier Providence'
    },
    child: {
        id: '/oeuvre/top-tier-providence/chapitre-163/',
        title: 'Chapitre 163'
    },
    entry: {
        index: 1,
        size: 675_666,
        type: 'image/jpeg'
    }
}).AssertWebsite();
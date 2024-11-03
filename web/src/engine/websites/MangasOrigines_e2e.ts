import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        size: 783_877,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
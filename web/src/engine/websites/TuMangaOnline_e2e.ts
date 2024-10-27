import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Redirection
new TestFixture({
    plugin: {
        id: 'tumangaonline',
        title: 'TuMangaOnline'
    },
    container: {
        url: 'https://zonatmo.com/library/manhwa/63944/enlanube',
        id: '/library/manhwa/63944/enlanube',
        title: 'En la nube'
    },
    child: {
        id: '/view_uploads/1408620',
        title: 'Capítulo 97.00 [RE HOMOS SCAN] (es)'
    },
    entry: {
        index: 5,
        size: 53_022,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Extraction
new TestFixture({
    plugin: {
        id: 'tumangaonline',
        title: 'TuMangaOnline'
    },
    container: {
        url: 'https://zonatmo.com/library/manhwa/34395/pheromone-holic',
        id: '/library/manhwa/34395/pheromone-holic',
        title: 'Pheromone Holic'
    },
    child: {
        id: '/view_uploads/558145',
        title: 'Capítulo 53.00  Adicta a la Feromona [FINAL] [Plot Twist No Fansub] (es)'
    },
    entry: {
        index: 1,
        size: 149_946,
        type: 'image/webp'
    }
}).AssertWebsite();
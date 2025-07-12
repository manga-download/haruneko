import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'astralmanga',
        title: 'AstralManga'
    },
    container: {
        url: 'https://astral-manga.fr/manga/01-wind-breaker/',
        id: JSON.stringify({ post: '4138', slug: '/manga/01-wind-breaker/' }),
        title: 'Wind Breaker'
    },
    child: {
        id: '/manga/01-wind-breaker/chapitre-66/',
        title: 'Chapitre 66 - Épisode spécial'
    },
    entry: {
        index: 1,
        size: 4_317_123,
        type: 'image/jpeg'
    }
}).AssertWebsite();
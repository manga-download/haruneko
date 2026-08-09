import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'astralmanga',
        title: 'AstralManga'
    },
    container: {
        url: 'https://astral-manga.fr/manga/b5fcc9e1-e069-412a-9eb2-dea9b8d6f08f',
        id: 'b5fcc9e1-e069-412a-9eb2-dea9b8d6f08f',
        title: 'Wind Breaker'
    },
    child: {
        id: 'd3d73cde-fd03-4e5a-adfc-19a06ad29d07',
        title: 'Chapitre 66 Épisode spécial'
    },
    entry: {
        index: 2,
        size: 4_107_912,
        type: 'image/jpeg'
    }
}).AssertWebsite();
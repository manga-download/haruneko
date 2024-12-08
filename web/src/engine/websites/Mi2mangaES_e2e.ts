import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mi2mangaes',
        title: 'Mi2mangaES'
    },
    container: {
        url: 'https://mi2manga.lat/manga/la-tirana-quiere-vivir-honestamente/',
        id: JSON.stringify({ post: "2101", slug: '/manga/la-tirana-quiere-vivir-honestamente/' }),
        title: 'La Tirana Quiere Vivir Honestamente'
    },
    child: {
        id: '/manga/la-tirana-quiere-vivir-honestamente/capitulo-59/',
        title: 'Capítulo 59'
    },
    entry: {
        index: 2,
        size: 491_456,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
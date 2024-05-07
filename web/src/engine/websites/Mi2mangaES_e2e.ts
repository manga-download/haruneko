import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mi2mangaes',
        title: 'Mi2mangaES'
    },
    container: {
        url: 'https://es.mi2manga.com/manga/la-tirana-quiere-vivir-honestamente/',
        id: JSON.stringify({ post: '942', slug: '/manga/la-tirana-quiere-vivir-honestamente/' }),
        title: 'La Tirana Quiere Vivir Honestamente'
    },
    child: {
        id: '/manga/la-tirana-quiere-vivir-honestamente/capitulo-59/',
        title: 'Capítulo 59'
    },
    entry: {
        index: 0,
        size: 84_386,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
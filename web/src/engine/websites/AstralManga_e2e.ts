import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'astralmanga',
        title: 'AstralManga'
    },
    container: {
        url: 'https://astral-manga.fr/manga/swordmasters-youngest-son/',
        id: JSON.stringify({ post: '2621', slug: '/manga/swordmasters-youngest-son/' }),
        title: 'Swordmaster’s Youngest Son'
    },
    child: {
        id: '/manga/swordmasters-youngest-son/chapitre-80/',
        title: 'Chapitre 80'
    },
    entry: {
        index: 1,
        size: 4_220_684,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
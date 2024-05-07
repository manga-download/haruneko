import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'romantikmanga',
        title: 'RomantikManga'
    },
    container: {
        url: 'https://romantikmanga.com/manga/how-to-survive-as-a-maid-in-a-horror-game/',
        id: JSON.stringify({ post: '29745', slug: '/manga/how-to-survive-as-a-maid-in-a-horror-game/' }),
        title: 'How to Survive as a Maid in a Horror Game'
    },
    child: {
        id: '/manga/how-to-survive-as-a-maid-in-a-horror-game/how-to-survive-as-a-maid-in-a-horror-game-blm-1401668364e00521d4ef2c2129ea7b58b/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 3_256_655,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
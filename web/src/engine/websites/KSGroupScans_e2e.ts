import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ksgroupscans',
        title: 'KSGroupScans'
    },
    container: {
        url: 'https://ksgroupscans.com/manga/saikyou-de-saisoku-no-mugen-level-up/',
        id: JSON.stringify({ post: '1985', slug: '/manga/saikyou-de-saisoku-no-mugen-level-up/' }),
        title: 'Saikyou de Saisoku no Mugen Level Up'
    },
    child: {
        id: '/manga/saikyou-de-saisoku-no-mugen-level-up/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 1_000_586,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
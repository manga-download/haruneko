import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangakomi',
        title: 'Manga Komi'
    },
    container: {
        url: 'https://mangakomi.io/manga/trapped-in-a-cursed-game-as-an-npc/',
        id: JSON.stringify({ post: '16177', slug: '/manga/trapped-in-a-cursed-game-as-an-npc/' }),
        title: 'Trapped In A Cursed Game As An Npc'
    },
    child: {
        id: '/manga/trapped-in-a-cursed-game-as-an-npc/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 511_218,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
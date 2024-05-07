import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hinapyon',
        title: 'Hinapyon'
    },
    container: {
        url: 'https://hinapyon.top/manga/a-manga-about-teaching-my-zombie-childhood-friend-the-real-feeling-of-segs/',
        id: '/manga/a-manga-about-teaching-my-zombie-childhood-friend-the-real-feeling-of-segs/',
        title: 'A Manga About Teaching My Zombie Childhood Friend The Real Feeling of Segs'
    },
    child: {
        id: '/a-manga-about-teaching-my-zombie-childhood-friend-the-real-feeling-of-segs-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 476_431,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
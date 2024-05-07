import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manga18-us',
        title: 'Manhuascan.us (Manga18.us)'
    },
    container: {
        url: 'https://manhuascan.us/manga/tyrant-of-the-tower-defense-game',
        id: '/manga/tyrant-of-the-tower-defense-game',
        title: 'Tyrant of the Tower Defense Game'
    },
    child: {
        id: '/manga/tyrant-of-the-tower-defense-game/chapter-1',
        title: '# Chapter 1'
    },
    entry: {
        index: 0,
        size: 84_693,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
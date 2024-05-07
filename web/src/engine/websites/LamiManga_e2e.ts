import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lamimanga',
        title: 'Lami-Manga'
    },
    container: {
        url: 'https://www.lami-manga.com/manga/player-who-cant-level-up/',
        id: '/manga/player-who-cant-level-up/',
        title: 'Player Who Can’t Level Up'
    },
    child: {
        id: '/player-who-cant-level-up-%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 145_472,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
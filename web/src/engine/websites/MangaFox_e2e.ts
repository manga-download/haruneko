import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangafox',
        title: 'MangaFox'
    },
    container: {
        url: 'https://fanfox.net/manga/darwin_s_game/',
        id: '/manga/darwin_s_game/',
        title: `Darwin's Game`
    },
    child: {
        id: '/manga/darwin_s_game/v01/c001/1.html',
        title: 'Vol.01 Ch.001 - game#1'
    },
    entry: {
        index: 0,
        size: 198_336,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangahere',
        title: 'MangaHere'
    },
    container: {
        url: 'https://www.mangahere.cc/manga/darwin_s_game/',
        id: '/manga/darwin_s_game/',
        title: `Darwin's Game`
    },
    child: {
        id: '/manga/darwin_s_game/c001/1.html',
        title: 'Ch.001'
    },
    entry: {
        index: 0,
        size: 186_010,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
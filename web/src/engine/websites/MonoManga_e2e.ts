import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'monomanga',
        title: 'MonoManga'
    },
    container: {
        url: 'https://monomanga.com/manga/tomodachi-game/',
        id: JSON.stringify({ post: '1944', slug: '/manga/tomodachi-game/' }),
        title: 'Tomodachi Game'
    },
    child: {
        id: '/manga/tomodachi-game/anime-sonrasi/bolum-26/',
        title: 'Bölüm 26 - Bu Oyunu "Reddedemezsiniz"'
    },
    entry: {
        index: 0,
        size: 763_441,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
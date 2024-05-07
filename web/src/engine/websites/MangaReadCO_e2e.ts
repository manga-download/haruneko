import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangareadco',
        title: 'Manga Read'
    },
    container: {
        url: 'https://mangaread.co/manga/tonari-no-kuroki-san-wa-nomu-to-yabai/',
        id: JSON.stringify({ post: '1263', slug: '/manga/tonari-no-kuroki-san-wa-nomu-to-yabai/' }),
        title: 'Tonari no Kuroki-san wa Nomu to Yabai'
    },
    child: {
        id: '/manga/tonari-no-kuroki-san-wa-nomu-to-yabai/ch-001/',
        title: 'Ch.001'
    },
    entry: {
        index: 0,
        size: 209_512,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
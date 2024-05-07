import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangawt',
        title: 'MangaWT'
    },
    container: {
        url: 'https://mangawt.com/manga/it-starts-with-a-mountain/',
        id: JSON.stringify({ post: '2044', slug: '/manga/it-starts-with-a-mountain/' }),
        title: 'It Starts With A Mountain'
    },
    child: {
        id: '/manga/it-starts-with-a-mountain/bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 1,
        size: 1_114_714,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'clovermanga',
        title: 'Clover Manga'
    },
    container: {
        url: 'https://clover-manga.com/manga/to-be-winner/',
        id: JSON.stringify({ post: '5461', slug: '/manga/to-be-winner/' }),
        title: 'To Be Winner'
    },
    child: {
        id: '/manga/to-be-winner/bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 0,
        size: 3_891_177,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
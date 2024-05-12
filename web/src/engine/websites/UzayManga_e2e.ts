import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'uzaymanga',
        title: 'Uzay Manga'
    },
    container: {
        url: 'https://uzaymanga.com/manga/52/olumsuzun-yolu',
        id: '/manga/52/olumsuzun-yolu',
        title: 'Ölümsüzün Yolu'
    },
    child: {
        id: '/manga/52/olumsuzun-yolu/2793/1-bolum',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 1_264_702,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
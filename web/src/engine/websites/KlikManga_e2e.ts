import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'klikmanga',
        title: 'KlikManga'
    },
    container: {
        url: 'https://klikmanga.id/manga/yuusha-yamemasu/',
        id: JSON.stringify({ post: '1851', slug: '/manga/yuusha-yamemasu/' }),
        title: 'Yuusha, Yamemasu'
    },
    child: {
        id: '/manga/yuusha-yamemasu/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 260_747,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
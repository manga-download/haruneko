import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangakik',
        title: 'MangaKik'
    },
    container: {
        url: 'https://mangakik.org/manga/age-of-terror/',
        id: JSON.stringify({ post: '2376', slug: '/manga/age-of-terror/' }),
        title: 'Age of Terror'
    },
    child: {
        id: '/manga/age-of-terror/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 291_837,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
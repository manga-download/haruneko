import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangalek',
        title: 'مانجا ليك (Mangalek)'
    },
    container: {
        url: 'https://manga-lek.net/manga/against-the-gods/',
        id: JSON.stringify({ post: '47', slug: '/manga/against-the-gods/' }),
        title: 'Against The Gods'
    },
    child: {
        id: '/manga/against-the-gods/00/',
        title: '00'
    },
    entry: {
        index: 2,
        size: 129_845,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
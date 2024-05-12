import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nitromanga',
        title: 'Nitro Manga'
    },
    container: {
        url: 'https://nitroscans.net/mangas/the-all-knowing-cultivator/',
        id: JSON.stringify({ post: '9062', slug: '/mangas/the-all-knowing-cultivator/' }),
        title: 'The All-Knowing Cultivator'
    },
    child: {
        id: '/mangas/the-all-knowing-cultivator/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 286_264,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
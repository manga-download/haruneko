import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'niverafansub',
        title: 'Nivera Fansub'
    },
    container: {
        url: 'https://niverafansub.co/manga/whispers-of-the-moon/',
        id: JSON.stringify({ post: '199', slug: '/manga/whispers-of-the-moon/' }),
        title: 'Whispers of the Moon'
    },
    child: {
        id: '/manga/whispers-of-the-moon/1-bolum/',
        title: '1. Bölüm'
    },
    entry: {
        index: 0,
        size: 4_693_578,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
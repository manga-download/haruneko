import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwalatino',
        title: 'Manhwa-Latino'
    },
    container: {
        url: 'https://manhwa-latino.com/manga/gunsmith-cats-burst-espanol/',
        id: JSON.stringify({ post: '10221', slug: '/manga/gunsmith-cats-burst-espanol/' }),
        title: 'Gunsmith Cats Burst - español'
    },
    child: {
        id: '/manga/gunsmith-cats-burst-espanol/capitulo-4/',
        title: 'Capitulo 4'
    },
    entry: {
        index: 0,
        size: 50_534,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
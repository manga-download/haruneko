import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'pojokmanga',
        title: 'PojokManga'
    },
    container: {
        url: 'https://pojokmanga.org/komik/magic-emperor/',
        id: JSON.stringify({ post: '2447', slug: '/komik/magic-emperor/' }),
        title: 'Magic Emperor'
    },
    child: {
        id: '/komik/magic-emperor/chapter-490/',
        title: 'Chapter 490'
    },
    entry: {
        index: 1,
        size: 563_233,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
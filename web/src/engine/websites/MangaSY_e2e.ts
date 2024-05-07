import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasy',
        title: 'Manga SY'
    },
    container: {
        url: 'https://www.mangasy.com/manga/bossy-president-please-love-me-gently/',
        id: JSON.stringify({ post: '9599', slug: '/manga/bossy-president-please-love-me-gently/' }),
        title: 'Bossy President, Please Love Me Gently'
    },
    child: {
        id: '/manga/bossy-president-please-love-me-gently/chapter-0-prologue/',
        title: 'Chapter 0-Prologue',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 82_554,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
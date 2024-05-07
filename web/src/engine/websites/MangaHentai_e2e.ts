import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangahentai',
        title: 'Manga Hentai'
    },
    container: {
        url: 'https://mangahentai.me/manga-hentai/an-outsiders-way-in/',
        id: JSON.stringify({ post: '153760', slug: '/manga-hentai/an-outsiders-way-in/' }),
        title: 'An Outsider’s Way In'
    },
    child: {
        id: '/manga-hentai/an-outsiders-way-in/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 14_291,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
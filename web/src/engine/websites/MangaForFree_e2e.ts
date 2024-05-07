import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaforfree',
        title: 'MangaForFree'
    },
    container: {
        url: 'https://mangaforfree.com/manga/the-owner-of-a-building-14/',
        id: JSON.stringify({ post: '351220', slug: '/manga/the-owner-of-a-building-14/' }),
        title: 'The Owner Of A Building'
    },
    child: {
        id: '/manga/the-owner-of-a-building-14/chapter-1-raw/',
        title: 'Chapter 1 raw'
    },
    entry: {
        index: 0,
        size: 282_702,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaeffect',
        title: 'MangaEffect'
    },
    container: {
        url: 'https://mangaeffect.com/manga/chotto-ippai/',
        id: JSON.stringify({ post: '5976', slug: '/manga/chotto-ippai/' }),
        title: 'Chotto Ippai!'
    },
    child: {
        id: '/manga/chotto-ippai/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 251_902,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
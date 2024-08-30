import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangachap',
        title: 'MangaChap'
    },
    container: {
        url: 'https://mangachap.com/manga/i-the-demon-lord-am-being-targeted-by-my-female-disciples/',
        id: JSON.stringify({ post: '1102', slug: '/manga/i-the-demon-lord-am-being-targeted-by-my-female-disciples/'}),
        title: 'I, The Demon Lord am being targeted by my female Disciples!'
    },
    child: {
        id: '/manga/i-the-demon-lord-am-being-targeted-by-my-female-disciples/chapter-33/',
        title: 'Chapter 33'
    },
    entry: {
        index: 0,
        size: 493_201,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'freemanga',
        title: 'Free Manga'
    },
    container: {
        url: 'https://freemanga.me/manga/9000-years-old-empress/',
        id: JSON.stringify({ post: '60529', slug: '/manga/9000-years-old-empress/' }),
        title: '9000 Years Old Empress'
    },
    child: {
        id: '/manga/9000-years-old-empress/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 269_197,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
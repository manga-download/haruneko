import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangabaz',
        title: 'Mangabaz'
    },
    container: {
        url: 'https://mangabaz.com/mangas/i-am-really-not-the-demon-lord/',
        id: JSON.stringify({ post: '15387', slug: '/mangas/i-am-really-not-the-demon-lord/' }),
        title: 'I Am Really Not the Demon Lord!'
    },
    child: {
        id: '/mangas/i-am-really-not-the-demon-lord/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 123_134,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
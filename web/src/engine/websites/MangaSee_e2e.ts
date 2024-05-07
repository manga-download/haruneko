import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasee',
        title: 'MangaSee'
    },
    container: {
        url: 'https://mangasee123.com/manga/Mairimashita-Iruma-kun',
        id: '/manga/Mairimashita-Iruma-kun',
        title: 'Welcome to Demon School! Iruma-kun'
    },
    child: {
        id: '/read-online/Mairimashita-Iruma-kun-chapter-323.html',
        title: 'Chapter 323'
    },
    entry: {
        index: 0,
        size: 262_059,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
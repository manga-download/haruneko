import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const fixture = new TestFixture({
    plugin: {
        id: 'mangapanda',
        title: 'MangaPanda'
    },
    container: {
        url: 'https://mangapanda.in/manga/sheriff-evans-lies',
        id: '/manga/sheriff-evans-lies',
        title: 'Sheriff Evans\' Lies'
    },
    child: {
        id: '/sheriff-evans-lies-chapter-162',
        title: 'Chapter 162'
    },
    entry: {
        index: 0,
        size: 1_286_660,
        type: 'image/jpeg'
    }
});
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());